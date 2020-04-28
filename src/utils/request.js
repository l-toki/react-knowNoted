import axios from "axios";
import qs from "qs";

const axiosConfig = {
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  }
};
export const ReqGetKnows = () => axios.get("/knows");
export const ReqGetTypes = () => axios.get("/types");
export const ReqAddKnows = (data) => {
  return axios.post("/add", qs.stringify(data), axiosConfig);
};
export const ReqDeleteOneKnow = (data) => {
  return axios.delete("/delete", {data:qs.stringify(data),headers:axiosConfig.headers});
};
export const ReqChangeOneKnow = (data) => {
  return axios.post("/change", qs.stringify(data), axiosConfig);
};
