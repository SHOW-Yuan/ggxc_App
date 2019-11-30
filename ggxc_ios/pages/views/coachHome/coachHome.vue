<template>
	<view class="box">
		<view class="status_bar">
		    <view class="top_view"></view>  
		</view> 
		<!-- 头部 -->
		<view class="coach-header">
			<view class="coach-header-left iconfont" @click="show=true">&#xe715;</view>
			<view>老司机课堂</view>
			<view class="coach-header-right iconfont"></view>
			<!-- <view class="coach-header-right iconfont">&#xe71f;</view>消息图标 -->
		</view>
		
		<!-- 信息区域 -->
		<view class="info-box">
			<view class="f-time">
			    <view class="f-time-box">
			      <image class="f-weather" src="../../../static/images/weather.png" mode=""></image>
			    </view>
			</view>
		</view>
		
		<!-- nav区域 -->
		<view class="nav">
			<block v-for="(item,index) in nav" :key="index">
				<navigator class="nav-go" :url="item.path" hover-class="navigator-hover">
					<image :src="item.img"></image>
					<text>{{item.text}}</text>
				</navigator>
			</block>
		</view>
		
		<!-- tab -->
		<view class="my-tab-box">
			<wuc-tab class="my-tab" :tab-list="tabList" :tabCur.sync="TabCur" @change="tabChange"></wuc-tab>
			<!-- 第一份 -->
			<view v-if="TabCur == 0">
				<block v-for="(item,index) in data1" :key="index">
					<view class="tab-item">
						<view class="tab-item-one">
							<text>{{item.studentname}}</text>
							<text class="km" v-if="item.subject === 1">科目一</text>
							<text class="km" v-else-if="item.subject === 2">科目二</text>
							<text class="km" v-else-if="item.subject === 3">科目三</text>
							<text class="km" v-else-if="item.subject === 4">科目四</text>
							<text class="pohon">{{item.studentmobile}}</text>
							<text class="iconfont" @click="telGo(item.studentmobile)">&#xe86d;</text>
						</view>
						<view class="tab-item-two">
							<view class="left">
								<view>
									<text class="start">{{item.startime}}</text>
									<text>开始时间</text>
								</view>
								<view>
									<text class="end">{{item.endtime}}</text>
									<text>结束时间</text>
								</view>
							</view>
							<view class="right" @click="sign(item.orderId)">签到</view>
						</view>
						<view class="tab-item-tree">
							{{item.date}}
						</view>
					</view>
				</block>
			</view>
			
			<!-- 第二份 -->
			<view v-else>
				<block v-for="(item,index) in data2" :key="index">
					<view class="tab-item">
						<view class="tab-item-one">
							<text>{{item.studentname}}</text>
							<text class="km" v-if="item.subject === 1">科目一</text>
							<text class="km" v-else-if="item.subject === 2">科目二</text>
							<text class="km" v-else-if="item.subject === 3">科目三</text>
							<text class="km" v-else-if="item.subject === 4">科目四</text>
							<text class="pohon">{{item.studentmobile}}</text>
							<text class="iconfont" @click="telGo(item.studentmobile)">&#xe86d;</text>
						</view>
						<view class="tab-item-two">
							<view class="left isTabCur">
								<view>
									<text class="start">{{item.startime}}</text>
									<text>开始时间</text>
								</view>
								<view>
									<text class="end">{{item.endtime}}</text>
									<text>结束时间</text>
								</view>
							</view>
						</view>
						<view class="tab-item-tree">
							{{item.date}}
						</view>
					</view>
				</block>
			</view>
			
		</view>
		
		
		<neil-modal 
		    :show="show" 
		    @close="show = false" 
		    title="退出" 
		    content="确定要退出吗?"
		    @cancel="bindBtn('cancel')" 
		    @confirm="bindBtn('confirm')">
		</neil-modal>
		
	</view>
</template>

<script>
	import WucTab from '@/components/wuc-tab/wuc-tab.vue';
	import neilModal  from '@/components/neil-modal/neil-modal.vue';
	export default {
		components: { WucTab, neilModal },
		data(){
			return {
				show:false,
				// nav数据
				nav:[
					{img:'../../../static/images/5_06.png',text:'我的排班',path:'/pages/views/coachHome/myGrade/myGrade'},
					{img:'../../../static/images/5_08.png',text:'车辆维修',path:'/pages/views/coachHome/carMaintain/carMaintain'},
					{img:'../../../static/images/5_10.png',text:'燃料管理',path:'/pages/views/coachHome/carFuel/carFuel'},
					{img:'../../../static/images/5_06.png',text:'代考审批',path:'/pages/views/coachHome/examAudit/examAudit'}
				],
				// tab切换
				TabCur: 0,
				tabList: [{ name: '最新预约' }, { name: '已培训' }],
				// 首页数据
				datas: [],
				data1:[],
				data2:[],
				dataList:[],
				formData: {
				  datas: [
				    {
				      page: 1 + "",
				      uid: "",
				      schoolcode: "",
				      coach_id: ""
				    }
				  ]
				},
				//签到 接口
				formData2: {
				  datas: [
				    {
				      uid: "",
				      schoolcode: "",
				      orderId: "",
				      coach_id: ""
				    }
				  ]
				}
			}
		},
		created() {
			// 最新预约信息
			this.datas = JSON.parse(uni.getStorageSync('datas'));
			this.formData.datas[0].uid = this.datas[0].uid;
			this.formData.datas[0].schoolcode = this.datas[0].userapps[0].schoolcode;
			this.formData.datas[0].coach_id = this.datas[0].id;
			this.loadData1()
			//签到接口
			this.formData2.datas[0].uid = this.datas[0].uid;
			this.formData2.datas[0].schoolcode = this.datas[0].userapps[0].schoolcode;
			this.formData2.datas[0].coach_id = this.datas[0].id;
			this.loadData2()
		},
		methods: {
			// 最新预约信息
			loadData1(){
				uni.request({
					url:this.$ip.url.ip1 + "/app/menmian-area/4QAAAAEBAB4/AQYX405",
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
						this.data1 = datas;
					}
				})
			},
			//已培训接口
			loadData2(){
				uni.request({
					url:this.$ip.url.ip1 + "/app/menmian-area/4QAAAAEBAB4/AQYX4010",
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
						this.data2 = datas;
					}
				})
			},
			// 切换数据
			tabChange(index) {
				this.TabCur = index;
				if(this.TabCur == 1){
					this.loadData2()
				}else if(this.TabCur == 0){
					this.loadData1()
				}
			},
			// 签到
			sign(orderId){
				this.formData2.datas[0].orderId = orderId;
				uni.request({
					url:this.$ip.url.ip1 + "/app/menmian-area/4QAAAAEBAB4/student_signin",
					method:'post',
					data:JSON.stringify(this.formData2),
					success: (res) => {
						let { data: { code, datas, msg } } = res;
						if(code!==200){
							uni.showToast({
								title: msg,
								icon:'none'
							})
							 return;
						}
						this.loadData1()
					}
				})
			},
			// 退出接口
			loadData3(){
				uni.request({
					url:this.$ip.url.ip1 + "/app/menmian-area/4QAAAAEBAB4/AQYX1027",
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
						uni.clearStorageSync();
						uni.showToast({
							title: "退出成功!",
							icon:'none'
						})
						uni.reLaunch({
							url:"../Login"
						})
					}
				})
			},
			// 拨打电话
			telGo(mob){
				uni.makePhoneCall({
					phoneNumber: mob //仅为示例
				})
			},
			bindBtn(val){
				if(val == 'confirm'){
					this.loadData3()
				}
				this.show = false
			}
			
		}
	}
</script>

<style>
	@import '../../assets/font/iconfont.css';
	.coach-header {
		position: fixed;
		z-index: 99;
		background-color: #ffffff;
		width: 100%;
		height: 80upx;
		line-height: 80upx;
		text-align: center;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 16upx;
		box-sizing: border-box;
		/* box-shadow: 0 0 5upx 4upx rgba(0,0,0,0.1); */
		box-shadow: 0 4upx 30upx #ebedf0;
	}
	.coach-header view:nth-child(2){
		font-size: 36upx;
		font-weight: 700;
		color: rgba(0,0,0,.87);
	}
	.coach-header-left,
	.coach-header-right{
		width: 80upx;
		height: 100%;
		font-size: 56upx;
		color: #00BB99;
	}
	/* nav */
	.nav {
		display: flex;
		width: 100%;
		padding-top: 16upx;
	}
	.nav-go {
		flex: 1;
		width: 180upx;
		height: 180upx;
		font-size: 24upx;
		color: #767676;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.nav-go image {
		width: 120upx;
		height: 120upx;
		border-radius: 50%;
		margin-bottom: 16upx;
	}
	/* tab */
	.my-tab-box {
		padding: 36upx 20upx;
		height: 100%;
	}
	.my-tab {
		width: 100%;
		text-align: center;
	}
	.tab-item {
		border:1upx solid #ccc;
		padding: 20upx;
		border-radius: 16upx;
		margin-top: 40upx;
	}
	.tab-item-one {
		position: relative;
	}
	.tab-item-one text:nth-child(1) {
		font-size: 36upx;
		font-weight: bold;
	}
	.tab-item-one .km {
		padding: 6upx 10upx;
		background: #7ad5c3;
		border-radius: 12upx;
		font-size: 24upx;
		color: #FFFFFF;
		margin: 0 14upx;
	}
	.tab-item-one .pohon {
		font-size: 24upx;
		color: #333333;
	}
	.tab-item-one text:last-child {
		float: right;
		transform: rotate(90deg);
		color: Crimson;
		font-size: 64upx;
		position: absolute;
		right: 0;
	}
	.tab-item-two {
		display: flex;
		align-items: center;
		margin: 12upx 0;
	}
	.tab-item-two .left {
		flex: 1;
		display: flex;
	}
	.tab-item-two .right {
		background-color: #00BB99;
		padding: 6upx 16upx;
		color: #FFFFFF;
		font-size: 30upx;
		border-radius: 16upx;
	}
	.tab-item-two .left>view {
		width: 30%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.tab-item-two .left>view .start {
		color: #05be9e;
		font-size: 54upx;
	}
	.tab-item-two .left>view .end {
		color: #f45f49;
		font-size: 54upx;
	}
	.tab-item-two .left>view text:last-child {
		font-size: 24upx;
		color: #c5c5c5;
		margin-top: 6upx;
	}
	.tab-item-tree {
		font-weight: bold;
		font-size: 24upx;
	}
	.isTabCur {
		justify-content: center;
	}
	/* 信息 */
	  .f-time{
	    height:260upx;
	    padding:100upx 20upx 0;
	  }
	  .f-time-box{
	    height:100%;
	    width:100%;
	    background: #fff3d9;
	    border-radius:26upx;
	    box-shadow: 0 4upx 12upx 6upx #ebedf0;
		text-align: center;
	  }
	  .f-weather{
	    height: 180upx;
	    width: 300upx;
		margin-top: 50upx;
	  }
</style>
