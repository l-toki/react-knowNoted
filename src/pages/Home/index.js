import React, { useState, useEffect } from "react";
import { Collapse, Button, message, Modal } from "antd";
import {getRequest,handleArrayYesNoByID,isEmpty} from '../../utils/utils';
import { ButtonBox } from "./style";
import Biji from "../Biji";
export default function Home() {
  const { Panel } = Collapse;
  const [allKnows, setAllKnows] = useState({}); // 全部知识点
  const [modalVisible, setModalVisible] = useState(false); //修改窗口弹出
  const [changeData,setChangeData]=useState({}) //将要修改的数据传递给子组件渲染
  const [changeStatu,setChangeStatu]=useState(false) //是否发生修改 被useEffect监听
  // 切换修改窗口的显示状态
  const tiggerModal = () => {
    setModalVisible(!modalVisible)
  };
  // 删除知识点
  // 点击删除的时候先把删除按钮改成不可点击，防止多次点击造成错误
  // 传入ID,类型,点击元素
  const deleteOneKnowFunc = (id, type, target) => {
    getRequest.deleteOneKnow({ id: id },(res) => {
      message.success("删除成功！");
      //进行深拷贝
      const knows = JSON.parse(JSON.stringify(allKnows));
      knows[type].splice(
        knows[type].findIndex((value) => {
          return value.id === id;
        }),
        1
      );
      setAllKnows(knows);
      window.localStorage.setItem("data", JSON.stringify(knows));
      const typeKnow = window.localStorage.getItem(type);
      if(!isEmpty(typeKnow)){
        handleArrayYesNoByID('delete',JSON.parse(typeKnow))
      }
    },(error)=>{
      target.disabled = false;
    })
  };
  // 修改知识点
  const changeOneKnowFunc = (know) => {
    setModalVisible(true)
    setChangeData(know)
  };
  // 修改知识点成功后，关闭弹窗，
  // 修改修改状态，让useEffect能够再次运行
  const changeOK=()=>{
    setModalVisible(!modalVisible)
    setChangeStatu(!changeStatu)
  }
  useEffect(() => {
    const data = window.localStorage.getItem("data");
    const change = window.localStorage.getItem("isChange");
    if ((change !== "false" && change !== undefined) || !data) {
      getRequest.getKnows((data)=>{
        setAllKnows(data);
        window.localStorage.setItem("isChange", false);
      })
    } else {
      setAllKnows(JSON.parse(data));
    }
  }, [changeStatu]);
  const renderList = () => {
    const renderData = [];
    for (const key in allKnows) {
      const data = (
        <Panel header={key} key={key}>
          {allKnows[key].map((item) => {
            return (
              <div key={item.id} style={{ position: "relative" }}>
                <Collapse>
                  <Panel header={item.title}>
                    <p>{item.content}</p>
                  </Panel>
                </Collapse>
                <ButtonBox>
                  <Button
                    type="primary"
                    onClick={() => {
                      changeOneKnowFunc(item);
                    }}
                  >
                    更改
                  </Button>
                  <Button
                    type="danger"
                    onClick={(e) => {
                      e.target.disabled = true;
                      deleteOneKnowFunc(item.id, key, e.target);
                    }}
                  >
                    删除
                  </Button>
                </ButtonBox>
              </div>
            );
          })}
        </Panel>
      );
      renderData.push(data);
    }
    return renderData;
  };
  return (
    <div>
      <Modal
        visible={modalVisible}
        title={'修改'}
        onCancel={tiggerModal}
        destroyOnClose={true}
        footer={[
          <Button key="back" onClick={tiggerModal}>
            取消
          </Button>,
        ]}
      >
        <Biji oldData={changeData} changeOk={changeOK}></Biji>
      </Modal>
      <Collapse>{allKnows ? renderList() : null}</Collapse>
    </div>
  );
}
