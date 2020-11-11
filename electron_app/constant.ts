export enum AppEvents {
  ReadCommodities = 'getCommodities',
  SaveCommodity = 'saveCommodity',
  ReadFragancias = 'getFragancias',
  SaveFragancias = 'saveChanges',
  CommodityById = 'commodityById',
  UploadFile = 'uploadFile',
  UpdateFragancia = 'updateFragancia',
  UpdateCommodity = 'updateCommodity',
  DownloadCommodities = 'downloadCommodities'
}

export enum FileStatus {
  Ok,
  Error,
}

export const CommoditiesFileName = 'primas.xlsx';
