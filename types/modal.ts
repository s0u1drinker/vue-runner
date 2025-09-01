type Modal = {
  id: string,
  type: ModalType,
  show: boolean,
}

export type ModalType = 'dialog' | 'loader' | 'info'

export type ModalButton = {
  title: string,
  action: () => void,
}

export type ModalDialog = Modal & {
  type: 'dialog',
  body: string,
  header: string,
  closable: true,
  buttons: {
    close: ModalButton,
    confirm: ModalButton,
  },
}

export type ModalLoader = Modal & {
  type: 'loader',
  closable: false,
  loaderName: string,
  text?: string,
}

export type ModalInfo = Modal & {
  type: 'info',
  header?: string,
  body: string,
  closable: true,
  buttons: {
    confirm: ModalButton,
  },
}