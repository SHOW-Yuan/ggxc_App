<template>
	<view class="box">
		<view class="status_bar">
		    <view class="top_view"></view>  
		</view> 
		<!-- 头部 -->
		<view class="coach-header">
			<view class="coach-header-left iconfont" @click="show=true">&#xe715;</view>
			<view>报表中心</view>
			<view class="coach-header-right iconfont"></view>
			<!-- <view class="coach-header-right iconfont">&#xe71f;</view>消息图标 -->
		</view>
		
		<view class="list-box">
			<block v-for="(item,index) in list" :key="index">
				<navigator class="list-go" :url="item.path" hover-class="navigator-hover">
					<view class="list-left">
						<view class="iconfont" :class="item.font"></view>
						<view>
							<view>{{item.title}}</view>
							<view>{{item.content}}</view>
						</view>
					</view>
					<view class="iconfont">&#xe6a3;</view>
				</navigator>
			</block>
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
				// 列表
				list:[
					{
						title:'数据快报',
						content:'数据快报',
						font:'icon-jishufuwu',
						path:'/pages/views/rectorHome/rectorHome'
					},
					{
						title:'招生统计表',
						content:'统计每个网点招生信息',
						font:'icon-shiyongwendang',
						path:'/pages/views/rectorHome/statistical/principalTable/principalTable'
					},
					{
						title:'收入统计表',
						content:'统计驾校收入情况',
						font:'icon-biaodanzujian-biaoge',
						path:'/pages/views/rectorHome/statistical/incTable'
					},
					{
						title:'考试合格率统计表',
						content:'驾校每个车型的考试合格率',
						font:'icon-tubiao-qiapian',
						path:'/pages/views/rectorHome/statistical/quaTable'
					},
					{
						title:'待考人数表',
						content:'统计每个科目待考人数的比例',
						font:'icon-tubiao-zhexiantu',
						path:'/pages/views/rectorHome/statistical/needTable'
					},
					{
						title:'推荐人统计',
						content:'统计学员的推荐人',
						font:'icon-tubiao-zhuzhuangtu',
						path:'/pages/views/rectorHome/statistical/referrer'
					},
					{
						title:'加油统计',
						content:'统计车辆的加油统计',
						font:'icon-gongyezujian-yibiaopan',
						path:'/pages/views/rectorHome/statistical/refuelTable/refuelTable'
					},
					{
						title:'维修统计',
						content:'统计车辆的维修统计',
						font:'icon-gongdan',
						path:'/pages/views/rectorHome/statistical/serviceTable'
					},
					{
						title:'燃料审核',
						content:'审核每辆车的燃料使用',
						font:'icon-daibanshixiang',
						path:'/pages/views/rectorHome/statistical/fuelAudit'
					},
					{
						title:'维修审核',
						content:'审核每辆车的维修费用',
						font:'icon-tianxie',
						path:'/pages/views/rectorHome/statistical/maintainAudit'
					},
					{
						title:'查看评价',
						content:'查看教练评价',
						font:'icon-zhunbeiliangchan',
						path:'/pages/views/rectorHome/statistical/examineEvaluate'
					}
				]
			}
		},
		created() {
			this.datas = JSON.parse(uni.getStorageSync('datas'));
			this.formData.datas[0].uid = this.datas[0].uid;
		},
		methods: {
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
						uni.reLaunch({
							url:"../../Login"
						})
						uni.showToast({
							title: "退出成功!",
							icon:'none'
						})
					}
				})
			},
			// 退出按钮
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
	@import '../../../assets/font/iconfont.css';
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
	
	/* 列表 */
	.list-box {
		width: 100%;
		padding-top:100upx;
	}
	.list-go {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20upx;
		margin-top: 30upx;
		box-shadow: 0 2px 15px #EBEDF0;
		border: 2upx solid #EBEDF0;
	}
	.list-go .list-left {
		flex: 1;
	}
	.list-go>view:nth-child(2) {
		width: 40upx;
		height: 40upx;
		line-height: 40upx;
		text-align: center;
	}
	.list-left {
		display: flex;
		align-items: center;
	}
	.list-left>view:nth-child(1) {
		width: 70upx;
		height: 70upx;
		line-height: 70upx;
		text-align: left;
		color: rgb(254, 210, 60);
		font-size: 50upx;
	}
	.list-left>view:nth-child(2) {
		flex: 1;
	}
	.list-left>view:nth-child(2) view:nth-child(1) {
		font-size: 30upx;
	}
	.list-left>view:nth-child(2) view:nth-child(2) {
		font-size: 24upx;
		color: #C0C0C0;
	}
	
</style>
