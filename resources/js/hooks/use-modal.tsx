import * as React from "react"

interface ModalStore {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

export const useModal = (): ModalStore => {
  const [isOpen, setIsOpen] = React.useState(false)

  const onOpen = React.useCallback(() => {
    setIsOpen(true)
  }, [])

  const onClose = React.useCallback(() => {
    setIsOpen(false)
  }, [])

  return {
    isOpen,
    onOpen,
    onClose,
  }
}