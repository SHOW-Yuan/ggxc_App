<template>
	<view class="box">
		<!-- 日 -->
		<view class="day">
			<view>当日报名人数：</view>
			<view class="grid">
				<block v-for="(item,index) in dayData" :key="index" v-if="index !== 'daynum'">
					<view class="grid-item">
						<text>{{index}}</text>
						<text>{{item}}人</text>
					</view>
				</block>
			</view>
			<view>当日报名总数: {{dayData.daynum}}</view>
		</view>
		<view class="xian"></view>
		<!-- 月 -->
		<view class="month">
			<view>当月报名人数：</view>
			<view class="grid">
				<block v-for="(item,index) in yueData" :key="index" v-if="index !== 'yuenum'">
					<view class="grid-item">
						<text>{{index}}</text>
						<text>{{item}}人</text>
					</view>
				</block>
			</view>
			<view>当月报名总数: {{yueData.yuenum}}</view>
		</view>
		<view class="xian"></view>
		<!-- 年 -->
		<view class="year">
			<view>当年报名人数：</view>
			<view class="grid">
				<block v-for="(item,index) in yearData" :key="index" v-if="index !== 'yearnum'">
					<view class="grid-item">
						<text>{{index}}</text>
						<text>{{item}}人</text>
					</view>
				</block>
			</view>
			<view>当年报名总数: {{yearData.yearnum}} 人</view>
			<view>当年毕业总数: {{biyeData.biyenum}} 人</view>
		</view>
	</view>
</template>

<script>
	export default {
		data(){
			return {
				// 请求数据
				formData:{
				  datas:[{
					date: "",
					uid:"",
					schoolcode:"",
				  }]
				},
				dayData:[],
				yueData:[],
				yearData:[],
				biyeData:[]
			}
		},
		created(){
			/*日期*/
			let date = new Date();
			let year = date.getFullYear();
			let month = date.getMonth() + 1;
			let strDate = date.getDate();
			if (month >= 1 && month <= 9) {
				month = "0" + month;
			}
			if (strDate >= 0 && strDate <= 9) {
				strDate = "0" + strDate;
			}
			let currentdate = year + '-' + month + '-' + strDate;
			this.formData.datas[0].date = currentdate;
			/*接口407*/
			this.datas =JSON.parse(uni.getStorageSync('datas'));
			this.formData.datas[0].uid = this.datas[0].uid;
			this.formData.datas[0].schoolcode = this.datas[0].userapps[0].schoolcode;
			this.loadData();
		 },
		methods: {
			loadData(){
				uni.request({
					url:this.$ip.url.ip1 + '/app/menmian-area/4QAAAAEBAB4/AQYX407',
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
						this.dayData = datas.day
						this.yueData = datas.yue
						this.yearData = datas.year
						this.biyeData = datas.biye
					}
				})
			}
		}
	}
</script>

<style>
	.box>view {
		/* border-bottom: 2upx solid #EE9900; */
		margin-bottom: 30upx;
		padding: 20upx 20upx 0;
	}
	.box>view>view:last-child,
	.box>view>view:nth-child(3) {
		font-size: 28upx;
		font-weight: 700;
	}
	.grid {
		display: flex;
		flex-wrap: wrap;
		padding-top: 20upx;
	}
	.grid .grid-item {
		width: 33%;
		height: 100upx;
		border-left: 4upx solid #CCCCCC;
		border-bottom: 4upx solid #CCCCCC;
		margin-bottom: 20upx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding-left: 50upx;
		font-size: 30upx;
		box-sizing: border-box;
	}
	.grid .grid-item text:nth-child(2){
		font-weight: 700;
	}
	.box .xian {
		border-top: 10upx solid #EEEEEE;
		margin: 0;
		padding: 0;
	}
</style>
