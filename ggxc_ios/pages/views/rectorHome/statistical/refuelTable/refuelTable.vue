<template>
	<view class="box">
		<!-- 日期区域 -->
		<view class="header-date">
			<view>
				<text @click="shangyue">上一月</text>
				<text>{{ynow}}-{{mnow}}</text>
				<text :class="{isBgc:isBgc}" @click="xiayue">下一月</text>
			</view>
		</view>
		
		<!-- 报名统计表 -->
		<view class="num-table">
			<view class="num-table-tile">收入统计表</view>
			<view class="con">
				<view></view>
				<view>
					<view>总量：<text>{{sum}}</text> </view>
					<view>总金额：<text>{{summoney}}</text> </view>
					<view>总加油次数：<text>{{number}}</text> </view>
				</view>
			</view>
		</view>
		
		<!-- 表格 -->
		<view class="my-table" v-if="(gasoline.length > 1)">
			<z-table :tableData='gasoline' :columns='baseColumns' stickSide @onClick='rowClick'></z-table>
		</view>
		<view class="my-table" v-if="(diesel.length > 1)">
			<z-table :tableData='diesel' :columns='baseColumns' stickSide @onClick='rowClick'></z-table>
		</view>
		<view class="my-table" v-if="(gas.length > 1)">
			<z-table :tableData='gas' :columns='baseColumns' stickSide @onClick='rowClick'></z-table>
		</view>
		
	</view>
</template>

<script>
	import zTable from "@/components/z-table/my-zTable.vue";
	export default {
		components: {zTable},
		data(){
			return {
				datas: [],
				//日期
				newDate: '', //当前的日期的信息
				ynow: '', //当前的年数
				mnow: '', //当前的月份
				date1: '', //当前的 2019-6
				isBgc:true,
				formData: { // 请求数据
				  datas: [{
				    date: "",
				    uid: "",
				    schoolcode: "",
				  }]
				},
				loadInfo:{},
				loadList:[],
				//汽油
				gasoline: [],
				gasolineSum:0,
				gasolineSummoney:0,
				gasolineNumber:0,
				//柴油
				diesel: [],
				dieselSum:0,
				dieselSummoney:0,
				dieselNumber:0,
				// 天然气
				gas: [],
				gasSum:0,
				gasSummoney:0,
				gasNumber:0,
				// 合计
				sum:0,
				summoney:0,
				number:0,
				
				baseTableData: [],
				baseColumns: [
					{
						title: "车牌号",
						key: "cphm",
						width: 200
					},
					{
						title: "燃料类型",
						key: "fultype",
						width: 150
					},
					{
						title: "燃料总量",
						key: "sum",
						width: 250
					},
					{
						title: "总金额",
						key: "summoney",
						width: 250
					},
					{
						title: "加油次数",
						key: "number",
						width: 200
					},
					{
						title: "详情",
						key: "xiang",
						width: 100,
						listenerClick:true
					}
				],
			}
		},
		created() {
		  //日历
		  this.newDate = new Date();
		  this.ynow = this.newDate.getFullYear();
		  let mon = this.newDate.getMonth(); //月份
		  this.mnow = ++mon; //先自增  后赋值
		  if (this.mnow < 10) {
		    this.mnow = '0' + `${this.mnow}`;
		  }
		  this.date1 = `${this.ynow}-${this.mnow}`;
		  /*接口406*/
		  this.datas = JSON.parse(uni.getStorageSync('datas'));
		  this.formData.datas[0].date = this.date1;
		  this.formData.datas[0].uid = this.datas[0].uid;
		  this.formData.datas[0].schoolcode = this.datas[0].userapps[0].schoolcode;
		  this.loadData();
		},
		methods: {
			loadData(){
				//合计
				let sum = 0;
				let summoney = 0;
				let number = 0;
				
				let gasolineSum = 0;
				let gasolineSummoney = 0;
				let gasolineNumber = 0;
				
				let dieselSum = 0;
				let dieselSummoney = 0;
				let dieselNumber = 0;
				
				let gasSum = 0;
				let gasSummoney = 0;
				let gasNumber = 0;
				uni.request({
					url:this.$ip.url.ip1 + "/app/menmian-area/4QAAAAEBAB4/FuelReportStatistics",
					method:'post',
					data:JSON.stringify(this.formData),
					success: (res) => {
						let { data: { code, datas, msg } } = res;
						if(code!==200){
							uni.showToast({
								title: msg,
								icon:'none'
							})
							 return;
						}
						if(datas.length == 0){
							this.loadInfo = {}
							this.baseTableData = []
							return;
						}
						this.gasoline = []
						this.diesel = []
						this.gas = []
						this.gasolineSum = 0
						this.dieselSum = 0
						this.gasSum = 0
						this.gasolineSummoney = 0
						this.dieselSummoney = 0
						this.gasSummoney = 0
						this.gasolineNumber = 0
						this.dieselNumber = 0
						this.gasNumber = 0
						this.sum = 0
						this.summoney = 0
						this.number = 0
						datas.map(x=>{
							if(x.fultype=== '汽油'){
								this.gasoline.push(x);
								gasolineSum += x.sum;
								gasolineSummoney += x.summoney;
								gasolineNumber += x.number;
								
								this.gasolineSum = gasolineSum;
								this.gasolineSummoney = gasolineSummoney.toFixed(2);
								this.gasolineNumber = gasolineNumber;
							}else if(x.fultype === '柴油'){
								this.diesel.push(x);
								dieselSum += x.sum;
								dieselSummoney += x.summoney;
								dieselNumber += x.number;
								
								this.dieselSum = dieselSum;
								this.dieselSummoney = dieselSummoney.toFixed(2);
								this.dieselNumber = dieselNumber;
							}else if (x.fultype === '天然气') {
								this.gas.push(x);
								gasSum += x.sum;
								gasSummoney += x.summoney;
								gasNumber += x.number;
								
								this.gasSum = gasSum;
								this.gasSummoney = gasSummoney.toFixed(2);
								this.gasNumber = gasNumber;
							}
						})
						this.gasoline.map(x=>{
							for (let k in x) {
							    if(x[k] === ''){
									x[k] = ' '
								}
							}
							x.xiang = `<span style=\"transform: rotate(90deg);font-size: 18px;display: block;margin: auto;color: rgb(4, 190, 158);\">|||</span>`
						})
						this.diesel.map(x=>{
							for (let k in x) {
							    if(x[k] === ''){
									x[k] = ' '
								}
							}
							x.xiang = `<span style=\"transform: rotate(90deg);font-size: 18px;display: block;margin: auto;color: rgb(4, 190, 158);\">|||</span>`
						})
						this.gas.map(x=>{
							for (let k in x) {
							    if(x[k] === ''){
									x[k] = ' '
								}
							}
							x.xiang = `<span style=\"transform: rotate(90deg);font-size: 18px;display: block;margin: auto;color: rgb(4, 190, 158);\">|||</span>`
						})
						this.gasoline.push({
							cphm:`<span style=\"color:rgb(1, 148, 218)\">小计</span>`,
							fultype:`<span style=\"color:rgb(1, 148, 218)\">汽油</span>`,
							sum:`<span style=\"color:rgb(1, 148, 218)\">${this.gasolineSum}</span>`,
							summoney:`<span style=\"color:rgb(1, 148, 218)\">${this.gasolineSummoney}</span>`,
							number: `<span style=\"color:rgb(1, 148, 218)\">${this.gasolineNumber}</span>`,
							xiang:' '
						})
						this.diesel.push({
							cphm:`<span style=\"color:rgb(1, 148, 218)\">小计</span>`,
							fultype:`<span style=\"color:rgb(1, 148, 218)\">柴油</span>`,
							sum:`<span style=\"color:rgb(1, 148, 218)\">${this.dieselSum}</span>`,
							summoney:`<span style=\"color:rgb(1, 148, 218)\">${this.dieselSummoney}</span>`,
							number: `<span style=\"color:rgb(1, 148, 218)\">${this.dieselNumber}</span>`,
							xiang:' '
						})
						this.gas.push({
							cphm:`<span style=\"color:rgb(1, 148, 218)\">小计</span>`,
							fultype:`<span style=\"color:rgb(1, 148, 218)\">天燃气</span>`,
							sum:`<span style=\"color:rgb(1, 148, 218)\">${this.gasSum}</span>`,
							summoney:`<span style=\"color:rgb(1, 148, 218)\">${this.gasSummoney}</span>`,
							number: `<span style=\"color:rgb(1, 148, 218)\">${this.gasNumber}</span>`,
							xiang:' '
						})
						sum += this.gasolineSum + this.dieselSum + this.gasSum;
						let a = this.gasolineSummoney -0
						let b = this.dieselSummoney -0
						let c = this.gasSummoney -0
						summoney += a + b + c;
						number += this.gasolineNumber + this.dieselNumber + this.gasNumber;
						
						this.sum = sum;
						this.summoney = summoney.toFixed(2);
						this.number = number;
					}
				})
			},
			
			//上一月  下一月
			shangyue() {
			  let date2 = `${this.ynow}-${this.mnow}`; //会变化的日期
			  if (this.mnow > 1) {
			    if (this.mnow <= 10) {
			      this.mnow--;
			      this.mnow = "0" + `${this.mnow}`;
			      date2 = `${this.ynow}-${this.mnow}`;
			    } else if (this.mnow > 10) {
			      this.mnow--;
			      date2 = `${this.ynow}-${this.mnow}`;
			    }
			  } else if (this.mnow <= 1) {
			    if (this.mnow < 10) {
			      this.ynow--;
			      this.mnow = "0" + `${this.mnow}`;
			      this.mnow = 12;
			      date2 = `${this.ynow}-${this.mnow}`;
			    }
			  }
			  this.isBgc = false
			  this.formData.datas[0].date = date2;
			  this.loadData();
			},
			xiayue() {
			  let date2 = `${this.ynow}-${this.mnow}`; //会变化的日期
			  if (date2 !== this.date1) {
			    if (this.mnow < 12) {
			      if (this.mnow < 9) {
			        this.mnow++;
			        this.mnow = "0" + `${this.mnow}`;
			        date2 = `${this.ynow}-${this.mnow}`;
			      } else {
			        this.mnow++;
			        date2 = `${this.ynow}-${this.mnow}`;
			      }
			    } else if (this.mnow >= 12) {
			      this.ynow++;
			      this.mnow = 1;
			      this.mnow = "0" + `${this.mnow}`;
			      date2 = `${this.ynow}-${this.mnow}`;
			    }
			    if (date2 == this.date1) {
			      this.isBgc = true
			    }
			    this.formData.datas[0].date = date2;
			    this.loadData();
			  } else if (date2 == this.date1) {
			    this.isBgc = true
			  }
			  this.formData.datas[0].date = date2;
			  this.loadData();
			},
			// 点击单元格
			rowClick(e){
				uni.navigateTo({
				    url: `/pages/views/rectorHome/statistical/refuelTable/fuelDetails/fuelDetails?cphm=${e.cphm}&date=${this.formData.datas[0].date}`
				});
			}
		}
	}
</script>

<style>
	/* 头部 */
	.header-date {
		font-size: 24upx;
	}
	.header-date>view {
		flex: 1;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #ECECEC;
		padding: 20upx;
		color: #000000;
	}
	.header-date>view text:nth-child(odd) {
		background-color: rgb(4, 190, 158);
		padding: 8upx 24upx;
		color: #FFFFFF;
	}
	.header-date>view text:nth-child(even) {
		font-weight: 700;
	}
	.num-table {
		padding: 20upx 20upx 0;
		font-size: 24upx;
	}
	.num-table-tile {
		font-size: 36upx;
		font-weight: 700;
	}
	.num-table>view {
		margin-bottom: 20upx;
		text-align: center;
	}
	.num-table>view .people,
	.num-table>view .money {
		font-size: 44upx;
		color: #FEC400;
		font-weight: 700;
		margin-right: 6upx;
	}
	.num-table>view .money {
		color: #00BB99;
	}
	.my-table {
		padding: 0 20upx;
	}
	.isBgc {
		background-color: #bdbdbd!important;
	}
	.z-table-container-row:last-child {
		color: skyblue;
	}
	.num-table .con {
		font-size: 32upx;
		text-align: left;
	}
	.num-table .con>view:first-child {
		text-align: center;
	}
	.num-table .con>view:last-child{
		display: flex;
		justify-content: flex-start;
		flex-direction: column;
	}
	.num-table .con>view:last-child view {
		flex: 1;
	}
	.num-table .con>view:last-child view text {
		color: #00BB99;
		font-weight: 700;
	}
</style>
