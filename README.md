# 知识点笔记

### `yarn start`

![](https://github.com/l-toki/react-knowNoted/blob/master/public/gif1.gif)



![](https://github.com/l-toki/react-knowNoted/blob/master/public/gif2.gif)

### BUG

在添加时，虽然动态添加到练习中，可是练习中添加的并不存在ID，当在笔记中修改该值时，会修改成功，可是练习中的值无法修改，因为不存在ID值，这时候不用理他，只要继续下一道，到最后再来一遍时，就会自动从全局中拿到最新的值进行更新。

### 功能模块（具体请看knows.xmind）

- 添加笔记（并且同步到练习中）
- 修改笔记（并且同步到练习中）
- 删除笔记（并且同步到练习中）
- 查看笔记
- 选择知识点类型，进行练习

### 注意

#### ！当前为第一版本，采用的是useEffect+useState+localstorage

#### ！第二版本正在开发，采用的是useContent+useReducer+useEffect+useState+localstorage(少量)，将大幅度优化代码，提高可读性

#### ！第三版本采用的是redux+hooks

#### ！需要自己建设后端接口

### 接口文档
|接口名|	说明|	请求方式|	返回数据|
| ------ | ---- | ---- | ---- | ---- | ---- |
|/knows|	获得所有数据|	GET|	Json|

|接口名|	说明	|请求方式|	返回数据|
| ------ | ---- | ---- | ---- |
|/add|	添加知识点|	POST|	Json|
|参数	|必选|	类型	|说明|
|type|	Y	|string|	类型|
|title	|	Y|string	|标题|
|content|	Y	|string|内容|
|problem|	N	|Array|	问题|

|接口名|	说明	|请求方式|	返回数据|
| ------ | ---- | ---- | ---- |
|/delete	|删除知识点|Delete	|Json|
|参数	|必选|	类型	说明|说明|
|id|	Y	|String|	ID|

|接口名|	说明|	请求方式	|返回数据|
| ------ | ---- | ---- | ---- |
|/change	|修改知识点	|Post|	Json|
|参数|	必选	|类型|	说明|
|id	|Y	|String|	ID|
|type| Y |string	|类型|
|title	| Y |string	|标题|
|content	| Y |string	|内容|
|problem	| N |Array|	问题|

#### 数据库内容

![image-20200428175243601](C:\Users\Letme\AppData\Roaming\Typora\typora-user-images\image-20200428175243601.png)