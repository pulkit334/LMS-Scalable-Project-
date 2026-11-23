export const handleApiError = (error) => {
  const status = error?.response?.status
  const message = error?.response?.data?.message

  switch (status) {
    case 400: throw new Error(message || 'Invalid data sent')
    case 401: throw new Error('You are not logged in')
    case 403: throw new Error('You are not allowed to do this')
    case 404: throw new Error('Resource not found')
    case 500: throw new Error('Server error — try again later')
    default:  throw new Error(message || 'Something went wrong')
  }
}