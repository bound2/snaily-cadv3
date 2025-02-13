import { Dispatch } from "react";
import { handleRequest, isSuccess, notify } from "../functions";
import {
  GET_BLEETS,
  GET_BLEET_BY_ID,
  SET_LOADING_BLEETS,
  UPDATE_BLEET,
  DELETE_BLEET_BY_ID,
  CREATE_BLEET,
} from "../types";
import Bleet from "../../interfaces/Bleet";
import Logger from "../Logger";

interface IDispatch {
  type: string;
  loading?: boolean;
  bleets?: Bleet[];
  bleet?: Bleet;
  error?: string;
}

export const getBleetPosts = () => async (dispatch: Dispatch<IDispatch>) => {
  dispatch({ type: SET_LOADING_BLEETS, loading: true });

  try {
    const res = await handleRequest("/bleeter", "GET");

    if (isSuccess(res)) {
      dispatch({
        type: GET_BLEETS,
        bleets: res.data.bleets,
      });
    }
  } catch (e) {
    Logger.error(GET_BLEETS, e);
  }

  dispatch({ type: SET_LOADING_BLEETS, loading: false });
};

export const getBleetById = (id: string) => async (dispatch: Dispatch<IDispatch>) => {
  dispatch({ type: SET_LOADING_BLEETS, loading: true });

  try {
    const res = await handleRequest(`/bleeter/${id}`, "GET");

    if (isSuccess(res)) {
      dispatch({
        type: GET_BLEET_BY_ID,
        bleet: res.data.bleet,
      });
    }
  } catch (e) {
    Logger.error(GET_BLEET_BY_ID, e);
  }

  dispatch({ type: SET_LOADING_BLEETS, loading: false });
};

export const createBleet = (data: { title: string; body: string; image: any }) => async (
  dispatch: Dispatch<IDispatch>,
): Promise<boolean | string> => {
  try {
    const { title, body, image } = data;

    const fd = new FormData();

    if (image) {
      fd.append("image", image, image?.name);
    }
    fd.append("title", title);
    fd.append("body", body);

    const res = await handleRequest("/bleeter", "POST", fd);

    if (isSuccess(res)) {
      dispatch({
        type: CREATE_BLEET,
      });

      return `/bleet/${res.data.id}`;
    } else {
      notify(res.data.error).warn();
      return false;
    }
  } catch (e) {
    Logger.error(CREATE_BLEET, e);
    return false;
  }
};

export const updateBleet = (data: object, id: string) => async (
  dispatch: Dispatch<IDispatch>,
): Promise<boolean | string> => {
  try {
    const res = await handleRequest(`/bleeter/${id}`, "PUT", data);

    if (isSuccess(res)) {
      dispatch({
        type: UPDATE_BLEET,
      });

      notify("Successfully updated bleet").success();
      return `/bleet/${id}`;
    } else {
      notify(res.data.error).warn();
      return false;
    }
  } catch (e) {
    Logger.error(GET_BLEET_BY_ID, e);
    return false;
  }
};

export const deleteBleet = (id: string) => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest(`/bleeter/${id}`, "DELETE");

    if (isSuccess(res)) {
      dispatch({
        type: DELETE_BLEET_BY_ID,
      });

      notify("Successfully deleted bleet").success();
      return true;
    } else {
      return false;
    }
  } catch (e) {
    Logger.error(DELETE_BLEET_BY_ID, e);
  }
};
