**流程**：
1. famaomao-client 负责前端对话，收集信息
1. famaomao-chatbot 负责解析前端所收集的数据，并转发给 famaomao-fff
1. famaomao-fff     负责创建新案源，并存入 famaomao-backend
1. famaomao-backend 负责资源管理

**路由和方法调用**
1. /caseSource
1. famaomao-chatbot/server/controller/prod/bot/CaseSourceSession/createCaseSource
1. famaomao-fff-url/caseSource

**收集的信息**
`session.dialogData`
| 字典属性          |  意义          |
| :----            | :------       |
|                  |               |


`postData`
| 字典属性          |  意义         |
| :----            | :------      |
| claimant.phone   | 咨询人的电话号码 |
| consult.sourceIP | 咨询人的 IP 地址|
| consult.signAmountPrediction| 案件金额预计|
| consult.consultAt | 咨询时间 |
| consult.isTargetPrediction| 是否是目标案源 |
| consult.from     | 案源来自哪个渠道 |
| consult.riskEvaluation | 风险等级 |
| consult.serviceModePrediction| 服务模式预测 |
| consult.data | ?|
|consult.minSignAmountPrediction| 最少金额预测 |
|consult.appeal |具体咨询的问题（选择领域之后的第一个问题）|
|consult.regionCity| 区域/城市 |
|consult.utm |???|
|consult.isChatBotFirst|废弃|
|consult.device | ?|
|consult.conversationId| 咨询会话ID|
|area| 案件所属领域 |
|status | 案件状态 |
|isChecked| ?|
|_id|可选 深度评估 案件ID|
|fromProfileId| 推荐人ID|


**万息案件线索**
| leads 字典属性          |  意义         |
| :----            | :------      |
|from            | 线索来源（必须） |
|city            | 咨询人所属城市（必须） |
|category        | 领域类别（必须）  |
|contact          |客户电话（必须）|
|records         |对话记录（必须）|
|appeal          |具体咨询的问题（选择领域之后的第一个问题）（必须）|
|product         | 所属产品(必须)|
|ip_addr          |咨询人的 IP地址|
|valuation        |标的金额|
|remark          | 备注 |
|status          | 状态 |
|inquiry_count   | 跟进次数 |
|rating          |线索评级|
|content          |什么内容 ？|
|owner_id         |律师公司ID|
|assignment      | 跟进律师 ID |
|nickname         |律师名字|
