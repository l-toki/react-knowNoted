import React, { useEffect, useState } from "react";
import {
  Select,
  Form,
  Button,
  Switch,
  Card,
  Tooltip,
  message,
  Modal,
} from "antd";
import { isEmpty, getRequest } from "../../utils/utils";
import { Content } from "./style";

export default function Lianxi() {
  const [types, setTypes] = useState([]); //所有类型
  const [allKnows, setAllKnows] = useState({}); //所有知识点
  const [selectType, setSelectType] = useState(""); //选中的类型
  const [haveKnows, setHaveKnows] = useState(false); //选中的类型是否存在知识点
  const [selectProblem, setSelectProblem] = useState(""); //随机到的问题
  const [selectKnow, setSelectKnow] = useState({}); //随机到的知识点
  const [finishedSelectKnows, setfinishedSelectKnows] = useState([]); //类型对应复习完成的知识点
  const [unfinishedSelectKnows, setUnfinishedSelectKnows] = useState([]); //类型对应未复习的知识点
  const [isFinish, setIsFinish] = useState(false); //选中的类型是否全部复习完毕
  const [seeAnswer, setSeeAnswer] = useState(false);
  const { Meta } = Card;
  const { confirm } = Modal;
  // 选择类型
  const selectTypeFunc = ({ type }) => {
    // 如果没有选择类型就点击选择，提示未选择
    if (!type) {
      return message.error("类型不得为空，请选择好类型后确认！！");
    }
    // 如果选择的类型没有变，则返回false无视
    if (type === selectType) {
      return false;
    }
    setSelectType(type);
    // // 先判断allKnows(所有的知识库)是否存在该类型，
    if(!allKnows[type]){
      getRequest.getTypes((data)=>{
        setTypes(data);
      })
      window.localStorage.removeItem(type)
      return message.error('没有对应题目,正在清理...')}
    // 查看本地有没有存储对应类型，有的话就返回到数据里面
    // 没有的话就向allKnows(所有的知识库)里面索引对应的类型
    // 然后把他们填充到对象中，存到本地，并且在unfinishedSelectKnows(未练习的知识点)里面全部添加
    const localStorageSelectType = window.localStorage.getItem(type);
    // 定义一个变量，作用域在if外面，用来存储对应类型的知识点
    let typeKnows, isFinish;
    if (!localStorageSelectType) {
      const obj = {
        yes: [],
        no: allKnows[type] || [],
        finish: false,
      };
      setUnfinishedSelectKnows(allKnows[type] || []);
      window.localStorage.setItem(type, JSON.stringify(obj));
      typeKnows = allKnows[type];
      isFinish = false;
    } else {
      const transformObj = JSON.parse(localStorageSelectType);
      setIsFinish(transformObj.finish);
      setfinishedSelectKnows(transformObj.yes);
      setUnfinishedSelectKnows(transformObj.no);
      typeKnows = transformObj.no;
      isFinish = transformObj.finish;
    }
    setIsFinish(isFinish);
    // 将对应类型的知识点(Array)放入随机函数中
    //如果allKnows中不存在对应的值,就不用渲染数据,显示不存在知识点即可
    if (!typeKnows) {
      return setHaveKnows(false);
    }
    setHaveKnows(true)
    // 判断是否全部复习完毕，是的话就不渲染问题和知识点了
    if (isFinish) {
      return false;
    }
    const know = randomProblemFunc(typeKnows);
    const problem = randomProblemFunc(know.problems);
    setSelectKnow(know);
    setSelectProblem(problem);
  };
  // 根据传入的列表随机返回其中一个值回去
  const randomProblemFunc = (knowList = []) => {
    const length = knowList.length;
    const random = knowList[Math.floor(Math.random() * length)];
    return random;
  };
  // 下一道题目
  const nextProblemFunc = () => {
    const overLength = unfinishedSelectKnows.length===0;
    if (overLength) {   
      return message.error("已经是最后一道题了！");
    }
    setSeeAnswer(false)
    const index = unfinishedSelectKnows.findIndex((value) => {
      return value.id === selectKnow.id;
    });
    const replaceList = [...finishedSelectKnows];
    const replaceUnList = [...unfinishedSelectKnows];
    replaceList.push(selectKnow);
    replaceUnList.splice(index, 1);
    setfinishedSelectKnows(replaceList);
    setUnfinishedSelectKnows(replaceUnList);
    const obj = {
      yes: replaceList,
      no: replaceUnList,
      finish:replaceUnList.length===0?true:false
    };
    window.localStorage.setItem(selectType, JSON.stringify(obj));
    if (replaceUnList.length===0) {
      setIsFinish(true)
      return false
   }
    const know = randomProblemFunc(replaceUnList);
    const problem = randomProblemFunc(know.problems);
    setSelectKnow(know);
    setSelectProblem(problem);
  };
  // 放弃当前题目，换一道
  const switchProblemFunc = () => {
    confirm({
      title: "确定要换题吗？",
      content: "该题不会记录完成，而是放进未完成问题中等待下次随机抽取",
      okText: "YES",
      cancelText: "No",
      onOk() {
        const know = randomProblemFunc(allKnows[selectType]);
        const problem = randomProblemFunc(know.problems);
        setSeeAnswer(false)
        setSelectKnow(know);
        setSelectProblem(problem);
      },
    });
  };
  const onChangeSeeAnswerFunc = () => {
    setSeeAnswer(seeAnswer=>!seeAnswer);
  };
  // 再做一次
  const tiggerIsFinishFunc = () => {
    //这里获取的是存储在localstorage中data对应类型的知识点
    // 如果添加了笔记，会直接在localstorage中的对应的type里面的no数组添加知识点
    // 这样会导致手动添加的知识点没有ID，如果此时在主页里面删除的话，是无法被删去的
    // 只会删除在data中对应类型ID的知识点，一旦点击这个重置按钮，就会拿到allKnows里面最新的值
    // 每次跳转到这个页面，就会判断localstorage中的isChange是否为true，为true就会向服务器发起请求获得最新的数据
    // 然后重新赋值给localstorage中对应的类型，实现了数据的更新
    setIsFinish(false)
    setSeeAnswer(false)
    setfinishedSelectKnows([]);
    setUnfinishedSelectKnows(allKnows[selectType] || []);
    const obj = {
      yes: [],
      no: allKnows[selectType] || [],
      finish: false,
    };
    const know = randomProblemFunc(allKnows[selectType]);
    const problem = randomProblemFunc(know.problems);
    window.localStorage.setItem(selectType, JSON.stringify(obj));
    setSelectKnow(know);
    setSelectProblem(problem);
  };
  useEffect(() => {
    const change = window.localStorage.getItem("isChange");
    if (change !== "false" && change !== undefined) {
      getRequest.getKnows((data) => {
        setAllKnows(data);
        window.localStorage.setItem("isChange", false);
      });
      getRequest.getTypes((data) => {
        setTypes(data);
      });
    } else {
      const know = window.localStorage.getItem("data");
      const types = window.localStorage.getItem("types");
      if (types) {
        setTypes(JSON.parse(types));
      }
      if (know) {
        setAllKnows(JSON.parse(know));
      }
    }
  }, []);
  return (
    <div style={{ textAlign: "center" }}>
      {!isEmpty(types)
        ? renderSelectType(types, selectTypeFunc)
        : "还没有记笔记"}
      {haveKnows ? (
        <>
          {isFinish ? (
            <div style={{ fontSize: "16px" }}>
              <span>和{selectType}相关题目已复习完成！！</span>
              <Button
                type="primary"
                style={{ margin: "0 5px" }}
                onClick={ tiggerIsFinishFunc }
              >
                再做一遍
              </Button>
            </div>
          ) : (
            <>
              <div style={{ fontSize: "16px" }}>
                <span>
                  当前第{finishedSelectKnows.length + 1}道，共
                  {unfinishedSelectKnows.length + finishedSelectKnows.length}道
                </span>
                <Button
                  type="primary"
                  style={{ margin: "0 5px" }}
                  onClick={nextProblemFunc}
                >
                  下一道
                </Button>
                <Tooltip
                  placement="top"
                  title="该题不会记录完成，而是放进未完成问题中等待下次随机抽取"
                >
                  <Button type="danger" onClick={switchProblemFunc}>
                    换题
                  </Button>
                </Tooltip>
              </div>
              <Content>
                <p>{selectProblem}</p>
                <span>查看答案</span>
                <Switch checked={seeAnswer} onChange={onChangeSeeAnswerFunc} />
                <Card
                  style={{ marginTop: 16, fontSize: "16px" }}
                  loading={!seeAnswer}
                >
                  <Meta
                    title={selectKnow.title}
                    description={selectKnow.content}
                  />
                </Card>
              </Content>
            </>
          )}
        </>
      ) : null}
    </div>
  );
}

function renderSelectType(types, selectTypeFunc) {
  const { Option } = Select;
  return (
    <Form
      onFinish={selectTypeFunc}
      style={{ display: "flex", justifyContent: "center" }}
    >
      <Form.Item name="type">
        <Select showSearch style={{ width: 200 }} placeholder="选择题目类型">
          {types.map((item, index) => (
            <Option value={item} key={index}>
              {item}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item style={{ marginLeft: "10px" }}>
        <Button type="primary" htmlType="submit">
          选择
        </Button>
      </Form.Item>
    </Form>
  );
}
