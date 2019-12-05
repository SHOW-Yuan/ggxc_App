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
			<view class="num-table-tile">报名统计表：</view>
			<view>
				<text>当前报名人数：</text>
				<text class="people">{{loadInfo.num ? loadInfo.num : 0}}</text>
				<text>人</text>
			</view>
			<view>
				<text>当月总金额：</text>
				<text class="money">{{loadInfo.number ? loadInfo.number : 0}}</text>
				<text>元</text>
			</view>
		</view>
		
		<!-- 表格 -->
		<view class="my-table">
			<z-table :tableData='baseTableData' :columns='baseColumns' stickSide @onClick='rowClick'></z-table>
		</view>
		
	</view>
</template>

<script>
	import zTable from "@/components/z-table/z-table.vue";
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
				baseTableData: [
					
				],
				baseColumns: [
					{
						title: "日期",
						key: "myDate",
						width: 100
					},
					{
						title: "A1",
						key: "A1",
						width: 100
					},
					{
						title: "A2",
						key: "A2",
						width: 100
					},
					{
						title: "A3",
						key: "A3",
						width: 100
					},
					{
						title: "B1",
						key: "B1",
						width: 100
					},
					{
						title: "B2",
						key: "B2",
						width: 100
					},
					{
						title: "C1",
						key: "C1",
						width: 100
					},
					{
						title: "C2",
						key: "C2",
						width: 100
					},
					{
						title: "C5",
						key: "C5",
						width: 100
					},
					{
						title: "小计",
						key: "xiao",
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
				uni.request({
					url:this.$ip.url.ip1 + '/app/menmian-area/4QAAAAEBAB4/AQYX406',
					method:'post',
					data:JSON.stringify(this.formData),
					success: (res) => {
						if(res.data.code!==200){
							uni.showToast({
								title: res.data.msg,
								icon:'none'
							})
							 return;
						}
						if(res.data.datas.length == 0){
							this.loadInfo = {}
							this.baseTableData = []
							return;
						}
						this.loadInfo = res.data
						this.baseTableData = this.loadInfo.datas
						let A1 = []
						let A2 = []
						let A3 = []
						let B1 = []
						let B2 = []
						let C1 = []
						let C2 = []
						let C5 = []
						let D = []
						let start = []
						let end = []
						this.baseTableData.map(x=>{
							for (let k in x) {
							    if(x[k] === ''){
									x[k] = '&nbsp;'
								}
							}
							A1.push(x.A1)
							A2.push(x.A2)
							A3.push(x.A3)
							B1.push(x.B1)
							B2.push(x.B2)
							C1.push(x.C1)
							C2.push(x.C2)
							C5.push(x.C5)
							D.push(x.D)
							start.push(x.daynumber)
							end.push(x.daynum)
							x.myDate = x.date.substr(x.date.length-2,2)
							x.xiao = x.daynumber + '/' + x.daynum
							x.xiang = `<span style=\"transform: rotate(90deg);font-size: 18px;display: block;margin: auto;color: rgb(4, 190, 158);\">|||</span>`
						})
						let xiaoJi = start.reduce(this.getSum) + '/' + end.reduce(this.getSum)
						let obj = {
							myDate:'合计',
							A1:A1.reduce(this.getSum),
							A2:A2.reduce(this.getSum),
							A3:A3.reduce(this.getSum),
							B1:B1.reduce(this.getSum),
							B2:B2.reduce(this.getSum),
							C1:C1.reduce(this.getSum),
							C2:C2.reduce(this.getSum),
							C5:C5.reduce(this.getSum),
							D:D.reduce(this.getSum),
							daynum:' ',
							daynumber:' ',
							xiang:'&nbsp;',
							xiao:xiaoJi
						}
						console.log(obj);
						this.baseTableData.push(obj)
						console.log(this.baseTableData);
					}
				})
			},
			// 点击单元格
			rowClick(e){
				uni.navigateTo({
				    url: `/pages/views/rectorHome/statistical/principalTable/detailsTable/detailsTable?date=` + e.date
				});
			},
			// 数组累加
			getSum(total, num) {
				if(total == '&nbsp;') {
					total = 0
				}
				if(num == '&nbsp;') {
					num = 0
				}
			    return total + num;
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
		padding: 20upx 10upx 0;
		font-size: 24upx;
	}
	.num-table-tile {
		font-size: 36upx;
		font-weight: 700;
	}
	.num-table>view {
		margin-bottom: 20upx;
		display: flex;
		align-items: center;
		justify-content: center;
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
</style>
