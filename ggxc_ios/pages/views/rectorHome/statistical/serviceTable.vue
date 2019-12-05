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
			<view class="num-table-tile">推荐人统计表</view>
		</view>
		
		<!-- 表格 -->
		<view class="my-table">
			<z-table :tableData='baseTableData' :columns='baseColumns' stickSide ></z-table>
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
				    schoolcode: ""
				  }]
				},
				loadInfo:{},
				loadList:[],
				totalNum:0,
				totalPic:0,
				baseTableData: [],
				baseColumns: [
					{
						title: "维修日期",
						key: "bxdate",
						width: 230
					},
					{
						title: "车牌号",
						key: "cphm",
						width: 200
					},
					{
						title: "维修部位",
						key: "part",
						width: 310
					},
					{
						title: "维修原因",
						key: "wxyy",
						width: 310
					},
					{
						title: "维修状态",
						key: "wxState",
						width: 310
					},
					{
						title: "教练名称",
						key: "coach",
						width: 150
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
					url:this.$ip.url.ip1 + "/app/menmian-area/4QAAAAEBAB4/VehicleRepair",
					method:'post',
					data:JSON.stringify(this.formData),
					success: (res) => {
						let {
						  data: {
						    code,
						    datas,
						    msg
						  }
						} = res;
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
						this.baseTableData = datas
						this.totalNum = this.baseTableData.length
						this.baseTableData.map(x=>{
							for (let k in x) {
							    if(x[k] === ''){
									x[k] = ' '
								}
							}
							if(x.wxState=='0'){
								x.wxState = '待维修'
							}else if(x.wxState == '1') {
								x.wxState = '已维修'
							}
						})
						console.log(this.baseTableData);
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
		padding: 20upx;
		font-size: 24upx;
	}
	.num-table-tile {
		font-size: 36upx;
		font-weight: 700;
		text-align: center;
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
	.total {
		text-align: center;
		background-color: #ECECEC;
		color: #000000;
		font-size: 28upx;
		padding: 20upx 0;
		font-weight: 700;
		transform: translateY(-8upx);
		border: 2upx solid #CCCCCC;
		box-sizing: border-box;
		border-top: none;
	}
	.total text {
		color: #FF0000;
	}
</style>
