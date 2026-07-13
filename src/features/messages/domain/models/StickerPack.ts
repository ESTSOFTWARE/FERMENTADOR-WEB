export interface StickerItem {
  assetUrl: string
  emojis:   string[]
}

export interface StickerPack {
  identifier: string
  name:       string
  trayImage:  string
  stickers:   StickerItem[]
}
