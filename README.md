# 装柜预算助手 · Container Loading Estimator

> 用浏览器快速估算集装箱装载数量、重量与初步物流成本，适合报价前比较多个装柜方案。
>
> A browser-based tool for estimating container loading quantity, weight, and preliminary logistics cost before quoting.

**无需注册 · 本地运行 · 数据不上传 · 支持 CSV 报告**

## 适合谁

- 外贸、货代和采购人员做出货前的快速测算
- 销售给客户报价前比较不同包装和柜型
- 需要一个轻量、可离线运行的装柜估算工具的团队

## 60 秒开始

在浏览器中估算一个集装箱的装载数量与物流费用，适合在准备报价或出货方案时做初步比较。无需注册，也不需要服务器。

1. 下载完整项目，双击打开 `index.html`（`engine.js` 必须和它放在同一文件夹）。
2. 选择柜型或填写柜内尺寸与最大载重。预设只供参考，请以实际箱体和承运人数据为准。
3. 添加货物，输入包装后的长、宽、高（毫米）、单重（千克）、数量和单价。数量必须是非负整数，总数最多 5000 件。
4. 输入人民币费用与保险费率。货值留空时，以预计装入货物的单价合计作为保险计算基数；填 0 则按 0 计算。
5. 查看预计装入数和费用，使用“导出 CSV”保存报告。图形为投影视图，最多展示前 180 件，计算结果包含全部预计装入货物。

## What it does

Enter container dimensions, cargo package dimensions, weight, quantity, price, and logistics fees. The tool returns an estimated loading quantity, weight summary, cost breakdown, average cost per loaded item, and a CSV report.

## 详细使用方法 | Detailed usage

### 中文

1. 打开 `index.html`，先选择 20GP、40GP 等预设柜型，或手动填写柜内长宽高和最大载重。
2. 在货物表中填写**包装后的尺寸**，再填写单重、数量、单价。尺寸单位为毫米，重量单位为千克。
3. 填写海运费、起运港费、目的港费、其他费用和保险费率，比较不同柜型或包装方案。
4. 查看预计装入件数、重量和费用明细；需要留档时点击“导出 CSV”。
5. 把 CSV 发送给同事或导入报价表前，先人工复核柜型、包装和承运人报价。

### English

1. Open `index.html` and choose a preset such as 20GP or 40GP, or enter the internal dimensions and maximum payload manually.
2. Add cargo using **packed dimensions**, unit weight, quantity, unit price, and the required fees. Dimensions are in millimeters and weight is in kilograms.
3. Review estimated loaded quantity, weight, volume usage, insurance, and total cost. Export a CSV report when you need to share or archive the estimate.
4. Treat the result as a planning estimate. Confirm packing rules, door clearance, weight distribution, and carrier pricing before making a final quotation.

## 隐私说明 | Privacy

所有柜型、货物和费用数据默认只保存在当前浏览器的本地存储中，项目没有内置服务器、账号系统或远程数据上传功能。清理浏览器数据、更换浏览器或使用无痕模式可能导致数据丢失。导出的 CSV 可能包含价格和货物信息，请按公司数据政策保存和分享。

All container, cargo, and cost data stays in the current browser's local storage by default. This project has no built-in server, account system, or remote upload. Clearing browser data, switching browsers, or using private browsing may remove saved data. Exported CSV files may contain commercial information and should be stored and shared according to your organization's policy.

柜型、货物及费用保存在当前浏览器的本地存储中；清理浏览器数据、更换浏览器或使用无痕模式可能丢失。货物资料不会主动上传到服务器。

## 计算范围与限制

本工具按货物体积排序，逐排、逐层摆放；当货物按原方向无法放入柜内时尝试长宽互换。结果是启发式估算，不保证最佳装载量。预算总成本为海运费、起运港费、目的港费、其他费用与保险费之和，平均物流成本按预计装入件数分摊。

算法**不检查货物之间的支撑和承重、允许朝向、柜门净尺寸、货物重心、绑扎、实际装卸顺序或法规要求**；图中可能出现现实中不能安全堆放的方案。不得仅凭此结果决定实际装柜、运输安全或最终报价，须由专业人员结合实际包装、箱况和承运人要求复核。

## 开发与测试

不需要构建或安装依赖。使用 Node.js 运行：

```sh
node --test tests/engine.test.js
```

测试覆盖输入校验、摆放边界和碰撞、重量限制、费用与 CSV 转义。本项目整理自此前的本地装柜预算原型；当前尚未指定开源许可证，公开代码不意味着自动授予他人使用许可。
