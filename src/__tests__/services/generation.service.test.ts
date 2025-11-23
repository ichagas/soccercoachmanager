import { describe, it, expect, beforeEach, vi } from 'vitest'
import { generationService } from '../../services/generation.service'
import pb from '../../services/pocketbase'

const mockGeneration = {
  id: 'gen-1',
  owner: 'user-1',
  input_text: 'Test input',
  style: 'hormozi' as const,
  carousel_pdf: 'test.pdf',
  caption: 'Test caption',
  pinned_comment: 'Test comment',
  hooks: ['Hook 1', 'Hook 2'],
  created: '2025-01-01T00:00:00Z',
  updated: '2025-01-01T00:00:00Z',
}

vi.mock('../../services/pocketbase', () => ({
  default: {
    currentUser: { id: 'user-1' },
    createGeneration: vi.fn(),
    getGeneration: vi.fn(),
    updateGeneration: vi.fn(),
    deleteGeneration: vi.fn(),
    countGenerations: vi.fn(),
    getFileUrl: vi.fn(),
    client: {
      collection: vi.fn(() => ({
        getList: vi.fn(),
        update: vi.fn(),
      })),
    },
  },
}))

describe('GenerationService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('create', () => {
    it('should create a new generation', async () => {
      const createData = {
        input_text: 'Test input',
        style: 'hormozi' as const,
        caption: 'Test caption',
        pinned_comment: 'Test comment',
        hooks: ['Hook 1', 'Hook 2'],
      }
      vi.mocked(pb.createGeneration).mockResolvedValue(mockGeneration as any)

      const result = await generationService.create(createData)

      expect(pb.createGeneration).toHaveBeenCalledWith({
        input_text: createData.input_text,
        style: createData.style,
        caption: createData.caption,
        pinned_comment: createData.pinned_comment,
        hooks: createData.hooks,
      })
      expect(result).toEqual(mockGeneration)
    })

    it('should handle creation errors', async () => {
      const error = { response: { message: 'Creation failed' } }
      vi.mocked(pb.createGeneration).mockRejectedValue(error)

      await expect(
        generationService.create({
          input_text: 'test',
          style: 'hormozi',
          caption: 'test',
          pinned_comment: 'test',
          hooks: [],
        })
      ).rejects.toThrow('Creation failed')
    })
  })

  describe('getById', () => {
    it('should fetch generation by ID', async () => {
      vi.mocked(pb.getGeneration).mockResolvedValue(mockGeneration as any)

      const result = await generationService.getById('gen-1')

      expect(pb.getGeneration).toHaveBeenCalledWith('gen-1')
      expect(result).toEqual(mockGeneration)
    })
  })

  describe('list', () => {
    it('should list generations with default options', async () => {
      const mockList = {
        items: [mockGeneration],
        page: 1,
        perPage: 20,
        totalItems: 1,
        totalPages: 1,
      }
      const mockCollection = {
        getList: vi.fn().mockResolvedValue(mockList),
      }
      vi.mocked(pb.client.collection).mockReturnValue(mockCollection as any)

      const result = await generationService.list()

      expect(pb.client.collection).toHaveBeenCalledWith('generations')
      expect(mockCollection.getList).toHaveBeenCalledWith(1, 20, {
        sort: '-created',
        filter: 'owner = "user-1"',
      })
      expect(result).toEqual(mockList)
    })

    it('should list generations with filters', async () => {
      const mockList = {
        items: [],
        page: 2,
        perPage: 10,
        totalItems: 0,
        totalPages: 0,
      }
      const mockCollection = {
        getList: vi.fn().mockResolvedValue(mockList),
      }
      vi.mocked(pb.client.collection).mockReturnValue(mockCollection as any)

      await generationService.list({
        page: 2,
        perPage: 10,
        style: 'welsh',
        searchQuery: 'marketing',
        sortBy: 'created',
      })

      expect(mockCollection.getList).toHaveBeenCalledWith(2, 10, {
        sort: 'created',
        filter: expect.stringContaining('style = "welsh"'),
      })
    })
  })

  describe('update', () => {
    it('should update generation', async () => {
      const updateData = { caption: 'Updated caption' }
      vi.mocked(pb.updateGeneration).mockResolvedValue(mockGeneration as any)

      const result = await generationService.update('gen-1', updateData)

      expect(pb.updateGeneration).toHaveBeenCalledWith('gen-1', updateData)
      expect(result).toEqual(mockGeneration)
    })
  })

  describe('delete', () => {
    it('should delete generation', async () => {
      vi.mocked(pb.deleteGeneration).mockResolvedValue(undefined)

      await generationService.delete('gen-1')

      expect(pb.deleteGeneration).toHaveBeenCalledWith('gen-1')
    })
  })

  describe('count', () => {
    it('should count generations', async () => {
      vi.mocked(pb.countGenerations).mockResolvedValue(42)

      const count = await generationService.count()

      expect(count).toBe(42)
    })
  })

  describe('uploadPDF', () => {
    it('should upload PDF to generation', async () => {
      const file = new File(['pdf content'], 'test.pdf', { type: 'application/pdf' })
      const mockCollection = {
        update: vi.fn().mockResolvedValue(mockGeneration),
      }
      vi.mocked(pb.client.collection).mockReturnValue(mockCollection as any)

      const result = await generationService.uploadPDF('gen-1', file)

      expect(pb.client.collection).toHaveBeenCalledWith('generations')
      expect(mockCollection.update).toHaveBeenCalled()
      expect(result).toEqual(mockGeneration)
    })
  })

  describe('getPDFUrl', () => {
    it('should return PDF URL', () => {
      vi.mocked(pb.getFileUrl).mockReturnValue('http://localhost:8090/files/test.pdf')

      const url = generationService.getPDFUrl(mockGeneration as any)

      expect(url).toBe('http://localhost:8090/files/test.pdf')
    })

    it('should return null if no PDF', () => {
      const genWithoutPDF = { ...mockGeneration, carousel_pdf: undefined }

      const url = generationService.getPDFUrl(genWithoutPDF as any)

      expect(url).toBeNull()
    })
  })
})
