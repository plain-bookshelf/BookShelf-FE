import { instance } from "./axios";

//책 대출 승인 페이지
export const getAllowList = async (page: number) => {
  return await instance.get(`/manage/approval-page?page=${page}`);
}

export const patchRentalAllow = async (registrationNumber: string) => {
  return await instance.patch(`/api/manage/rental-pass?registrationNumber=${registrationNumber}`);
}

//책 대출 목록 페이지
export const getRentalList = async (page: number) => {
  return await instance.get(`/manage/rental-status?page=${page}`);
}

export const patchBookRetrun = async (registrationNumber: string) => {
  return await instance.patch(`/api/manage/return-check?registrationNumber=${registrationNumber}`);
}

export const getOverdueList = async (page: number) => {
  return await instance.get(`/manage/rental-status/overdue?page=${page}`);
}

export const getUserSearch = async (nickName: string) => {
  return await instance.get(`/manage/rental-status/nickname?nickName=${nickName}`)
}