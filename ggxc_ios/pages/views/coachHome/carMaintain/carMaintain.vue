<template>
	<view class="box">
		<!-- 日期区域 -->
		<view class="header-date">
			<view @click="goBack()">添加</view>
			<view>
				<text @click="shangyue">上一月</text>
				<text>{{ynow}}-{{mnow}}</text>
				<text :class="{isBgc:isBgc}" @click="xiayue">下一月</text>
			</view>
		</view>
		
		<!-- 列表数据 -->
		<view class="list-box">
			<block v-for="(item,index) in listDatas" :key="index">
				<view class="item-box">
					<view class="item-box-one">
						<view>
							<text>{{item.cphm}}</text>
							<text>车牌号</text>
						</view>
						<view>
							<text>{{item.Money}}￥</text>
							<text>维修费</text>
						</view>
					</view>
					<view class="item-box-two">
						<text>{{item.part}}</text>
						<text>{{item.bxdate}}</text>
					</view>
				</view>
			</block>
		</view>
		
	</view>
</template>

<script>
	export default {
		data(){
			return {
				newDate: "", //当前的日期的信息
				ynow: "", //当前的年数
				mnow: "", //当前的月份
				date1: "", //当前的 2019-6
				datas: [],
				isVisible: false,
				
				formData: {
				  datas: [
				    {
				      uid: '',
				      date: "",
				      schoolcode: '',
				      coach_id: '',
				    }
				  ]
				},
				listDatas: [],
				// 下一月背景
				isBgc:true
			}
		},
		created() {
		  //日历
		  this.newDate = new Date();
		  this.ynow = this.newDate.getFullYear();
		  this.mnow1 = this.newDate.getMonth(); //月份
		  this.mnow = ++this.mnow1; //先自增  后赋值
		  if (this.mnow < 10) {
		    this.mnow = "0" + `${this.mnow}`;
		  }
		  this.date1 = `${this.ynow}-${this.mnow}`;
		  this.datas = JSON.parse(uni.getStorageSync('datas'));
		  this.formData.datas[0].date = `${this.ynow}-${this.mnow}`;
		  this.defaultValueData = this.formData.datas[0].date.split("-");
		  this.formData.datas[0].uid = this.datas[0].uid;
		  this.formData.datas[0].schoolcode = this.datas[0].userapps[0].schoolcode;
		  this.formData.datas[0].coach_id = this.datas[0].id;
		  console.log(this.formData.datas[0].coach_id);
		  this.loadData();
		},
		methods: {
			// 加载页面数据
			loadData(){
				uni.request({
					url:this.$ip.url.ip1 + "/app/menmian-area/4QAAAAEBAB4/CoachVehicleRepair",
					method:'post',
					data:JSON.stringify(this.formData),
					success: (res) => {
						let { data: { code, datas, msg } } = res;
						uni.stopPullDownRefresh();
						if(code!==200){
							uni.showToast({
								title: msg,
								icon:'none'
							})
							this.listDatas = [];
							return;
						}
						this.listDatas = datas;
						console.log(this.listDatas);
					}
				})
			},
			//上一月  下一月
			shangyue() {
			  var date2 = `${this.ynow}-${this.mnow}`; //会变化的日期
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
			  console.log(this.formData.datas[0].date)
			  this.loadData();
			},
			xiayue() {
			  var date2 = `${this.ynow}-${this.mnow}`; //会变化的日期
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
			  console.log(this.formData.datas[0].date)
			  this.loadData();
			},
			// 监听下拉刷新
			onPullDownRefresh() {
				this.loadData();
			},
			// 前往添加页面
			goBack(){
				uni.navigateTo({
				    url: '/pages/views/coachHome/carMaintain/service/service'
				});
			}
		}
	}
</script>

<style>
	page{
		background-color: #FFFFFF;
	}
	.box {
		padding: 0 30upx;
		background-color: #FFFFFF;
	}
	/* 头部 */
	.header-date {
		padding: 16upx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 24upx;
		border-bottom: 2upx solid #eee;
	}
	.header-date view:nth-child(1) {
		width: 100upx;
		background-color: rgb(4, 190, 158);
		border-radius: 30upx;
		padding: 12upx;
		text-align: center;
		margin-right: 20upx;
		color: #FFFFFF;
	}
	.header-date view:nth-child(2) {
		flex: 1;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #ECECEC;
		padding: 20upx;
		color: #000000;
	}
	.header-date view:nth-child(2) text:nth-child(odd) {
		background-color: rgb(4, 190, 158);
		padding: 8upx 24upx;
		color: #FFFFFF;
	}
	.header-date view:nth-child(2) text:nth-child(even) {
		font-weight: 700;
	}
	/* 下边的 */
	.list-box {
		border-radius: 20upx;
		padding: 20upx 0;
	}
	.item-box {
		border: 2upx solid #ccc;
		border-radius: 20upx;
		margin-bottom: 20upx;
		overflow: hidden;
		background-color: #FFFFFF;
	}
	.item-box .item-box-one {
		padding: 0 30upx;
		display: flex;
		justify-content: center;
		font-size: 24upx;
		color: #828282;
	}
	.item-box .item-box-one view {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 40upx 0;
	}
	.item-box-one view text:nth-child(1) {
		color: #f87144;
		font-size: 32upx;
		font-weight: 700;
		margin-bottom: 4upx;
	}
	.item-box-one view:nth-child(1) text:nth-child(1){
		color: #00BB99;
	}
	.item-box-two {
		background-color: #eeeeee;
		padding: 20upx 30upx;
		display: flex;
		justify-content: space-between;
		font-size: 24upx;
		font-weight: 700;
		align-items: center;
	}
	.isBgc {
		background-color: #bdbdbd!important;
	}
</style>
