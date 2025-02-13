import { Dispatch } from "react";
import { ArrestReport, Ticket, Warrant } from "../../interfaces/Record";
import { handleRequest, isSuccess, notify } from "../functions";
import Logger from "../Logger";
import { SEARCH_CITIZEN } from "../types";

export interface CourtResults {
  warrants: Warrant[];
  arrestReports: ArrestReport[];
  tickets: Ticket[];
  citizenId: string;
}

interface Item {
  value: string;
  label: string;
}

export interface ExpungementRequest {
  warrants: Item[];
  arrestReports: Item[];
  tickets: Item[];
  id?: string;
  user_id?: string;
  citizenId?: string;
  user?: {
    username: string;
  };
  citizen: {
    full_name: string;
  };
}

interface IDispatch {
  type: string;
  courtResult?: CourtResults;
  requests?: ExpungementRequest[];
}

export const searchCitizen = (name: string) => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest("/citizen/info", "POST", { name });

    if (isSuccess(res)) {
      dispatch({
        type: SEARCH_CITIZEN,
        courtResult: {
          citizenId: res.data.citizenId,
          tickets: res.data.tickets,
          warrants: res.data.warrants,
          arrestReports: res.data.arrestReports,
        },
      });
    } else {
      notify(res.data.error).warn();
    }
  } catch (e) {
    Logger.error("SEARCH_CITIZEN", e);
  }
};

export const requestExpungement = (citizenId: string, data: object) => async (
  dispatch: Dispatch<IDispatch>,
) => {
  try {
    const res = await handleRequest(`/citizen/expungement-request/${citizenId}`, "POST", data);

    if (isSuccess(res)) {
      dispatch({
        type: "REQUEST_EXPUNGEMENT",
      });

      notify("Successfully requested expungement").success();
    }
  } catch (e) {
    Logger.error("REQUEST_EXPUNGEMENT", e);
  }
};

export const getExpungementRequests = () => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest("/citizen/expungement-requests", "GET");

    if (isSuccess(res)) {
      dispatch({
        type: "GET_EXPUNGEMENT_REQUESTS",
        requests: res.data?.requests || [],
      });
    }
  } catch (e) {
    Logger.error("GET_EXPUNGEMENT_REQUESTS", e);
  }
};
