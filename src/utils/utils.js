import { useState, useRef, useEffect } from "react";
import {
  ReqGetKnows,
  ReqGetTypes,
  ReqAddKnows,
  ReqChangeOneKnow,
  ReqDeleteOneKnow,
} from "./request";
import {message} from 'antd'
const toString = (data) => {
  return Object.prototype.toString.call(data);
};
export const useXState = (initState) => {
  const [state, setState] = useState(initState);
  const ref = useRef();
  const setXState = (newState, cb) => {
    setState((prev) => {
      ref.current = cb;
      return newState;
    });
  };
  useEffect(() => {
    if (ref.current) {
      ref.current();
    }
  });
  return [state, setXState];
};
export const debounce = (fn, delay) => {
  let time;
  return function (...args) {
    if (time) {
      clearTimeout(time);
    }
    time = setTimeout(() => {
      fn.apply(this, args);
      clearTimeout(time);
    }, delay);
  };
};
export const getRequest = {
  getTypes(fn) {
    ReqGetTypes().then((res) => {
      const data = [...res.data];
      window.localStorage.setItem("types", JSON.stringify(data));
      if (fn) {
        fn(data);
      }
    });
  },
  getKnows(fn) {
    ReqGetKnows().then((res) => {
      const unFilterData = res.data;
      let result = {};
      unFilterData.forEach((element) => {
        result[element.type]
          ? result[element.type].push(element)
          : (result[element.type] = [element]);
      });
      window.localStorage.setItem("data", JSON.stringify(result));
      if (fn) {
        fn(result);
      }
    });
  },
  addKnows(values, fn) {
    ReqAddKnows(values)
      .then(() => {
        if (fn) {
          fn();
        }
      })
      .catch((error) => {
        message.error("添加失败");
      });
  },
  changeOneKnow(value, fn) {
    ReqChangeOneKnow(value)
      .then(() => {
        if (fn) {
          fn();
        }
      })
      .catch((error) => {
        message.error("修改失败");
      });
  },
  deleteOneKnow(id, fn,fner) {
    ReqDeleteOneKnow(id)
      .then(() => {
        if (fn) {
          fn();
        }
      })
      .catch((error) => {
        if (fner) {
          fner()
        }
      });
  },
};
export const handleArrayYesNoByID = (type, source, ID, data = null) => {
  const target = JSON.parse(JSON.stringify(source));
  let whoIndex;
  for (const key in target) {
    const element = target[key];
    if(!isArray(element)){
      continue
    }
    const index = element.findIndex((item) => {
      return item.id === ID;
    });
    if (index !== -1) {
      whoIndex = {
        who: key,
        index,
      };
    }
  }
  switch (type) {
    case "replace":
      target[whoIndex.who].splice(whoIndex.index, 1, data);
      break;
    case "delete":
      target[whoIndex.who].splice(whoIndex.index, 1);
      break;
    default:
      throw "请填写 replace delete 两种类型中的一种！";
  }
  return target;
};
export const addArrayByID = (source, data) => {
  const target = JSON.parse(JSON.stringify(source));
  target.no.push(data);
  return target;
};
export const isEmpty = (data) => {
  if (isObject(data)) {
    if (Object.keys(data).length > 0) {
      return false;
    } else {
      return true;
    }
  }
  if (isArray(data)) {
    if (data.length > 0) {
      return false;
    } else {
      return true;
    }
  }
  if (data) {
    return false;
  } else {
    return true;
  }
};
export const isObject = (data) => {
  if (toString(data) === "[object Object]") {
    return true;
  } else {
    return false;
  }
};
export const isArray = (data) => {
  if (toString(data) === "[object Array]") {
    return true;
  } else {
    return false;
  }
};
