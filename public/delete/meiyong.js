// 自制按钮 已废弃
const style = {
  "danger-color": "#fff",
  "danger-bgc": "#ff4d4f",
  "danger-focus-bgc": "#ff7875",
  "danger-active-bgc": "#d9363e",
  "primary-color": "#fff",
  "primary-bgc": "#1890ff",
  "primary-focus-bgc": "#40a9ff",
  "primary-active-bgc": "#096dd9",
};
const SelfButton = styled.div`
  position: absolute;
  top: 8px;
  right: ${(props) => (props.num === 1 ? 125 : 40)}px;
  padding: 3px 15px 4px 19px;
  border: 1px solid #d2c9c9;
  border-radius: 2px;
  outline: none;
  cursor: pointer;
  letter-spacing: 3px;
  font-size: 15px;
  color: ${(props) => style[`${props.type}-color`]};
  background-color: ${(props) => style[`${props.type}-bgc`]};
  border-color: ${(props) => style[`${props.type}-bgc`]};
  user-select: none;
  :hover,
  :focus {
    background-color: ${(props) => style[`${props.type}-focus-bgc`]};
    border-color: ${(props) => style[`${props.type}-focus-bgc`]};
  }
  :active {
    background-color: ${(props) => style[`${props.type}-active-bgc`]};
    border-color: ${(props) => style[`${props.type}-active-bgc`]};
  }
`;
{
  /* <SelfButton num={1} type={"primary"}>
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      changeOneKnow(item.id);
                    }}
                  >
                    更改
                  </div>
                </SelfButton>
                <SelfButton num={2} type={"danger"}>
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteOneKnow(item.id);
                    }}
                  >
                    删除
                  </div>
                </SelfButton> */
}
