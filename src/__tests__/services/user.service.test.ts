import { describe, it, expect, beforeEach, vi } from 'vitest'
import { userService } from '../../services/user.service'
import pb from '../../services/pocketbase'

vi.mock('../../services/pocketbase', () => ({
  default: {
    currentUser: {
      id: 'user-1',
      email: 'test@example.com',
      brand_headshot: 'headshot.jpg',
      brand_logo: 'logo.png',
      brand_color: '#667eea',
      brand_tagline: 'DM me GROW',
      is_pro: false,
      preferred_language: 'en',
    },
    client: {
      collection: vi.fn(() => ({
        getOne: vi.fn(),
      })),
    },
    updateUser: vi.fn(),
    uploadFile: vi.fn(),
    getFileUrl: vi.fn(),
  },
}))

const mockUser = {
  id: 'user-1',
  email: 'test@example.com',
  brand_headshot: 'headshot.jpg',
  brand_logo: 'logo.png',
  brand_color: '#667eea',
  brand_tagline: 'DM me GROW',
  is_pro: false,
  preferred_language: 'en' as const,
}

describe('UserService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getCurrentUser', () => {
    it('should return current user', () => {
      const user = userService.getCurrentUser()
      expect(user).toEqual(mockUser)
    })
  })

  describe('getUser', () => {
    it('should fetch user by ID', async () => {
      const mockCollection = {
        getOne: vi.fn().mockResolvedValue(mockUser),
      }
      vi.mocked(pb.client.collection).mockReturnValue(mockCollection as any)

      const user = await userService.getUser('user-1')

      expect(pb.client.collection).toHaveBeenCalledWith('users')
      expect(mockCollection.getOne).toHaveBeenCalledWith('user-1')
      expect(user).toEqual(mockUser)
    })
  })

  describe('updateUser', () => {
    it('should update user profile', async () => {
      const updateData = { brand_color: '#ff0000' }
      vi.mocked(pb.updateUser).mockResolvedValue(mockUser as any)

      const result = await userService.updateUser('user-1', updateData)

      expect(pb.updateUser).toHaveBeenCalledWith('user-1', updateData)
      expect(result).toEqual(mockUser)
    })

    it('should handle update errors', async () => {
      const error = { response: { message: 'Update failed' } }
      vi.mocked(pb.updateUser).mockRejectedValue(error)

      await expect(userService.updateUser('user-1', {})).rejects.toThrow('Update failed')
    })
  })

  describe('uploadFile', () => {
    it('should upload file successfully', async () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      vi.mocked(pb.uploadFile).mockResolvedValue(mockUser as any)

      const result = await userService.uploadFile('user-1', 'brand_headshot', file)

      expect(pb.uploadFile).toHaveBeenCalledWith('users', 'user-1', 'brand_headshot', file)
      expect(result).toEqual(mockUser)
    })
  })

  describe('updateBrandKit', () => {
    it('should update brand kit', async () => {
      const brandKit = {
        headshot: 'new-headshot.jpg',
        logo: 'new-logo.png',
        color: '#667eea',
        tagline: 'New tagline',
      }
      vi.mocked(pb.updateUser).mockResolvedValue(mockUser as any)

      const result = await userService.updateBrandKit('user-1', brandKit)

      expect(pb.updateUser).toHaveBeenCalledWith('user-1', {
        brand_headshot: brandKit.headshot,
        brand_logo: brandKit.logo,
        brand_color: brandKit.color,
        brand_tagline: brandKit.tagline,
      })
      expect(result).toEqual(mockUser)
    })
  })

  describe('getBrandKit', () => {
    it('should get brand kit for user', async () => {
      const mockCollection = {
        getOne: vi.fn().mockResolvedValue(mockUser),
      }
      vi.mocked(pb.client.collection).mockReturnValue(mockCollection as any)

      const brandKit = await userService.getBrandKit('user-1')

      expect(brandKit).toEqual({
        headshot: mockUser.brand_headshot,
        logo: mockUser.brand_logo,
        color: mockUser.brand_color,
        tagline: mockUser.brand_tagline,
      })
    })
  })

  describe('trainCustomVoice', () => {
    it('should save custom voice samples', async () => {
      const samples = 'Sample post 1\nSample post 2'
      vi.mocked(pb.updateUser).mockResolvedValue(mockUser as any)

      await userService.trainCustomVoice('user-1', samples)

      expect(pb.updateUser).toHaveBeenCalledWith('user-1', {
        custom_voice_samples: samples,
      })
    })
  })

  describe('updateLanguage', () => {
    it('should update language preference', async () => {
      vi.mocked(pb.updateUser).mockResolvedValue(mockUser as any)

      await userService.updateLanguage('user-1', 'pt-BR')

      expect(pb.updateUser).toHaveBeenCalledWith('user-1', {
        preferred_language: 'pt-BR',
      })
    })
  })

  describe('getFileUrl', () => {
    it('should return file URL', () => {
      vi.mocked(pb.getFileUrl).mockReturnValue('http://localhost:8090/files/headshot.jpg')

      const url = userService.getFileUrl(mockUser as any, 'headshot.jpg')

      expect(pb.getFileUrl).toHaveBeenCalledWith(mockUser, 'headshot.jpg', undefined)
      expect(url).toBe('http://localhost:8090/files/headshot.jpg')
    })
  })
})
