import moment from "moment";

export const momentNowTS = () =>
  parseInt(moment(new Date(Date.now())).format("X"));
