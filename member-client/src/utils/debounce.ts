export function debounce<Params extends unknown[], ReturnType>(
    func: (...args: Params) => ReturnType,
    timeout: number,
  ): (...args: Params) => void {
    let timer: NodeJS.Timeout
    return (...args: Params) => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        func(...args)
      }, timeout)
    }
  }
  