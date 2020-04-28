import React, { useEffect, useState } from "react";
import {
  isEmpty,
  getRequest,
  handleArrayYesNoByID,
  addArrayByID,
} from "../../utils/utils";
import { Select, Input, Form, Divider, Button, message } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 24 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
  },
};
const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 20, offset: 4 },
    sm: { span: 24, offset: 0 },
  },
};
export default function Biji(props) {
  const [types, setTypes] = useState([]);
  const [name, setName] = useState("");
  const { Option } = Select;
  const { TextArea } = Input;
  const [form] = Form.useForm();
  const onNameChange = (event) => {
    setName(event.target.value);
  };
  //添加类型
  const addItemFunc = () => {
    if(isEmpty(name)){
      return message.error('类型不得为空')
    }
    setTypes([...types, name]);
    window.localStorage.setItem("types", JSON.stringify([...types, name]));
    setName("");
  };
  //添加知识点
  const addKnowFunc = (values) => {
    if (isEmpty(values.problems)) {
      values.problems = "没有问题0.0,点击下面的按钮查看知识点";
    }
    getRequest.addKnows(values,() => {
      message.success("添加成功");
      window.localStorage.setItem("isChange", true);
      form.resetFields(); //这是重置为默认值
      //在localstorage中寻找键值为类型的数据，如果存在，则在类型.no中将数据push进去
      const localType = window.localStorage.getItem(values.type);
      if (localType) {
        const newKnows = addArrayByID(JSON.parse(localType), values);
        window.localStorage.setItem(values.type, JSON.stringify(newKnows));
      }
    })
  };
  // 修改知识点
  const changeKnowFunc = (values) => {
    const id = props.oldData.id;
    //判断问题是否为空
    if (isEmpty(values.problems)) {
      values.problems = "没有问题0.0";
    }
    const newKnows = { id, ...values };
    getRequest.changeOneKnow(newKnows,() => {
      const oldType = props.oldData.type;
      const newType = values.type;
      // 判断类型是否改变
      // 如果改变，添加localstorage中新类型的值(存在的话)，删除localstorage中old类型的值;
      // 如果没改变，修改localstorage中类型的值
      const typeChange = (oldType !== newType);
      const oldTypeLocalStorage = window.localStorage.getItem(oldType);
      // 判断类型是否改变
      if (typeChange) {
        const newTypeLocalStorage = window.localStorage.getItem(newType);
        if (!isEmpty(newTypeLocalStorage)) {
          window.localStorage.setItem(
            newType,
            JSON.stringify(addArrayByID(newTypeLocalStorage))
          );
        }
      }
      // 如果localstorage中存在类型的值
      if (!isEmpty(oldTypeLocalStorage)) {
        window.localStorage.setItem(
          oldType,
          JSON.stringify(handleArrayYesNoByID(
            typeChange ? "delete" : "replace",
            JSON.parse(oldTypeLocalStorage),
            id,
            newKnows
          ))
        );
      }
      message.success("修改成功");
      window.localStorage.setItem("isChange", true);
      props.changeOk();
    })
  };
  useEffect(() => {
    const type = window.localStorage.getItem("types");
    if (isEmpty(type)) {
      getRequest.getTypes((data) => {
        setTypes(data);
      });
    } else {
      setTypes(JSON.parse(type));
    }
  }, []);
  return (
    <>
      <Form
        form={form}
        onFinish={props.changeOk ? changeKnowFunc : addKnowFunc}
        initialValues={
          props.oldData || {
            type: types[0],
            title: "",
            content: "",
            problems: [],
          }
        }
      >
        <Form.Item
          rules={[
            {
              required: true,
              message: "不能为空",
            },
          ]}
          label="类型"
          name="type"
        >
          <Select
            style={{ width: 240 }}
            placeholder="custom dropdown render"
            dropdownRender={(menu) => (
              <div>
                {menu}
                <Divider style={{ margin: "4px 0" }} />
                <div
                  style={{ display: "flex", flexWrap: "nowrap", padding: 8 }}
                >
                  <Input
                    style={{ flex: "auto" }}
                    value={name}
                    onChange={onNameChange}
                  />
                  <span
                    style={{
                      flex: "none",
                      padding: "8px",
                      display: "block",
                      cursor: "pointer",
                    }}
                    onClick={addItemFunc}
                  >
                    <PlusOutlined /> Add item
                  </span>
                </div>
              </div>
            )}
          >
            {types.map((item) => (
              <Option key={item}>{item}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          rules={[
            {
              required: true,
              message: "不能为空",
            },
          ]}
          label="标题"
          name="title"
        >
          <Input placeholder="输入知识点标题" name="title" autoComplete="off"></Input>
        </Form.Item>
        <Form.Item
          rules={[
            {
              required: true,
              message: "不能为空",
            },
          ]}
          label="内容"
          name="content"
        >
          <TextArea placeholder="输入知识点内容" name="content"></TextArea>
        </Form.Item>
        <Form.List name="problems">
          {(fields, { add, remove }) => {
            return (
              <div style={{ textAlign: "center" }}>
                {fields.map((field, index) => (
                  <Form.Item
                    {...(index === 0
                      ? formItemLayout
                      : formItemLayoutWithOutLabel)}
                    label={index === 0 ? "问题" : ""}
                    labelAlign={"left"}
                    required={false}
                    key={field.key}
                  >
                    <Form.Item
                      {...field}
                      validateTrigger={["onChange"]}
                      rules={[
                        {
                          required: true,
                          whitespace: true,
                          message: "不能为空",
                        },
                      ]}
                      noStyle
                    >
                      <Input placeholder="输入问题" style={{ width: "60%" }} />
                    </Form.Item>
                    {fields.length > 1 ? (
                      <MinusCircleOutlined
                        className="dynamic-delete-button"
                        style={{ margin: "0 8px" }}
                        onClick={() => {
                          remove(field.name);
                        }}
                      />
                    ) : null}
                  </Form.Item>
                ))}
                <Form.Item style={{ textAlign: "center" }}>
                  <Button
                    type="dashed"
                    onClick={() => {
                      add();
                    }}
                    style={{ width: "60%" }}
                  >
                    <PlusOutlined /> Add field
                  </Button>
                </Form.Item>
              </div>
            );
          }}
        </Form.List>
        <Form.Item
          style={{ textAlign: "center" }}
          rules={[
            {
              required: true,
              message: "不能为空",
            },
          ]}
        >
          <Button type="primary" htmlType="submit" style={{ width: "60%" }}>
            {props.oldData ? "修改" : "添加"}
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
