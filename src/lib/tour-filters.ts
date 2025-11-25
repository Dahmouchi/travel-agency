/* eslint-disable @typescript-eslint/no-explicit-any */
// Utility functions for tour filtering

export type TourFilterParams = {
  type?: string[]
  categories?: string[]
  natures?: string[]
  destinations?: string[]
  accommodationType?: string[]
  difficultyLevel?: string[]
  priceMin?: number
  priceMax?: number
  durationDaysMin?: number
  durationDaysMax?: number
  groupSizeMax?: number
}

export function buildTourFilterWhere(params: TourFilterParams) {
  const where: any = {
    active: true,
    archive: false,
  }

  // Filter by travel type
  if (params.type && params.type.length > 0) {
    where.type = { in: params.type }
  }

  // Filter by categories
  if (params.categories && params.categories.length > 0) {
    where.categories = {
      some: {
        id: { in: params.categories },
      },
    }
  }

  // Filter by natures
  if (params.natures && params.natures.length > 0) {
    where.natures = {
      some: {
        id: { in: params.natures },
      },
    }
  }

  // Filter by destinations
  if (params.destinations && params.destinations.length > 0) {
    where.destinations = {
      some: {
        id: { in: params.destinations },
      },
    }
  }

  // Filter by accommodation type
  if (params.accommodationType && params.accommodationType.length > 0) {
    where.accommodationType = { in: params.accommodationType }
  }

  // Filter by difficulty level
  if (params.difficultyLevel && params.difficultyLevel.length > 0) {
    where.difficultyLevel = { in: params.difficultyLevel.map(Number) }
  }

  // Filter by price range
  if (params.priceMin !== undefined || params.priceMax !== undefined) {
    where.OR = [
      {
        priceDiscounted: {
          ...(params.priceMin !== undefined && { gte: params.priceMin }),
          ...(params.priceMax !== undefined && { lte: params.priceMax }),
        },
      },
      {
        priceDiscounted: null,
        priceOriginal: {
          ...(params.priceMin !== undefined && { gte: params.priceMin }),
          ...(params.priceMax !== undefined && { lte: params.priceMax }),
        },
      },
    ]
  }

  // Filter by duration
  if (params.durationDaysMin !== undefined || params.durationDaysMax !== undefined) {
    where.durationDays = {
      ...(params.durationDaysMin !== undefined && { gte: params.durationDaysMin }),
      ...(params.durationDaysMax !== undefined && { lte: params.durationDaysMax }),
    }
  }

  // Filter by group size
  if (params.groupSizeMax !== undefined) {
    where.groupSizeMax = { lte: params.groupSizeMax }
  }

  return where
}

export function parseFilterParams(searchParams: URLSearchParams): TourFilterParams {
  const params: TourFilterParams = {}

  // Parse array parameters
  const typeParam = searchParams.getAll("type[]")
  if (typeParam.length > 0) params.type = typeParam

  const categoriesParam = searchParams.getAll("categories[]")
  if (categoriesParam.length > 0) params.categories = categoriesParam

  const naturesParam = searchParams.getAll("natures[]")
  if (naturesParam.length > 0) params.natures = naturesParam

  const destinationsParam = searchParams.getAll("destinations[]")
  if (destinationsParam.length > 0) params.destinations = destinationsParam

  const accommodationTypeParam = searchParams.getAll("accommodationType[]")
  if (accommodationTypeParam.length > 0) params.accommodationType = accommodationTypeParam

  const difficultyLevelParam = searchParams.getAll("difficultyLevel[]")
  if (difficultyLevelParam.length > 0) params.difficultyLevel = difficultyLevelParam

  // Parse numeric parameters
  const priceMin = searchParams.get("priceMin")
  if (priceMin) params.priceMin = Number(priceMin)

  const priceMax = searchParams.get("priceMax")
  if (priceMax) params.priceMax = Number(priceMax)

  const durationDaysMin = searchParams.get("durationDaysMin")
  if (durationDaysMin) params.durationDaysMin = Number(durationDaysMin)

  const durationDaysMax = searchParams.get("durationDaysMax")
  if (durationDaysMax) params.durationDaysMax = Number(durationDaysMax)

  const groupSizeMax = searchParams.get("groupSizeMax")
  if (groupSizeMax) params.groupSizeMax = Number(groupSizeMax)

  return params
}
