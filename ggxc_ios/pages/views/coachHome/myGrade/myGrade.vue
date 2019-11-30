<template>
	<view class="box">
		<!-- 教练信息 -->
		<view class="header-info">
			<view class="header-one">
				<view>
					<image src="../../../../static/images/01_17.png"></image>
					<image src="../../../../static/images/01_17.png"></image>
					<image src="../../../../static/images/01_17.png"></image>
					<image src="../../../../static/images/01_17.png"></image>
					<image src="../../../../static/images/01_17.png"></image>
					<text>5分</text>
				</view>
				<view>
					{{date}}
				</view>
			</view>
			<view class="header-two">
				<view>
					<image src="../../../../static/images/6_03.png"></image>
				</view>
				<view class="header-two-right">
					<view>
						<text>{{data.coachname}}</text>
						<text>{{data.teachage}}年</text>
					</view>
					<view>{{data.mobile}}</view>
				</view>
			</view>
		</view>
		
		<!-- 排班区域 -->
		<view class="bottom-list">
			<wuc-tab class="my-tab" :tab-list="tabList" :tabCur.sync="TabCur" @change="tabChange"></wuc-tab>
			<view class="date-list">
				<block v-for="(item,index) in times" :key="index">
					<view @click="tabDate(index)">
						<text>{{item.time}}</text>
						<text :class="workdatesIndex == index ? 'isFlag' : ''">{{item.week}}</text>
					</view>
				</block>
			</view>
			<view class="date-list-item">
				<block v-for="(item,index) in workdatesItem" :key="index">
					<view class="pad-rig">
						<view class="item-list">
							<view>{{item.starttime}}-{{item.endtime}}</view>
							<view>{{item.price}}元</view>
							<view>剩余{{item.remainAmout}}人</view>
						</view>
					</view>
				</block>
			</view>
			<view class="footer">点击天数,查看自己排班详情</view>
		</view>
		
	</view>
</template>

<script>
	import WucTab from '@/components/wuc-tab/wuc-tab.vue';
	export default {
		components: { WucTab },
		data(){
			return {
				date:'', // 当前时间
				datas: [], // 从本地获取
				data:[],
				// 信息
				formData: {
				  datas: [
				    {
				      subject: "",
				      uid: "",
				      schoolcode: "",
				      date: "",
				      coach_id: ''
				    }
				  ]
				},
				// tab切换
				TabCur: 0,
				tabList: [{ name: '科目二' }, { name: '科目三' }],
				// 五天时间
				times:[],
				// 星期几的所有数据
				workdates:[],
				// 星期几某天数据
				workdatesItem:[],
				// 星期几
				workdatesIndex: 0
			}
		},
		created() {
			this.gainTime();
			this.datas = JSON.parse(uni.getStorageSync('datas'));
			//获取排班信息列表 3035  科目二
			this.formData.datas[0].subject = 2;
			this.formData.datas[0].uid = this.datas[0].uid;
			this.formData.datas[0].schoolcode = this.datas[0].userapps[0].schoolcode;
			this.formData.datas[0].coach_id = this.datas[0].id;
			this.loadData();
			// 时间日期
			const dateNew = new Date();
			const year = dateNew.getFullYear();
			let month = dateNew.getMonth(); //月份
			month = month + 1
			const date = dateNew.getDate();
			this.date = year + '-' + month + '-' + date
		},
		methods:{
			//获取五天时间
			gainTime() {
			  var now = new Date();
			  var nowTime = now.getTime();
			  var oneDayTime = 24 * 60 * 60 * 1000;
			  for (var i = 0; i < 5; i++) {
			    //显示周一
			    var ShowTime = nowTime + i * oneDayTime;
			    //初始化日期时间
			    var myDate = new Date(ShowTime);
			    var year = myDate.getFullYear();
			    var month = ("0" + (myDate.getMonth() + 1)).slice(-2);
			    var date = ("0" + myDate.getDate()).slice(-2);
			
			    // console.log(date)
			    var str = "星期" + "日一二三四五六".charAt(myDate.getDay());
			    if (i === 0) {
			      str = "今天";
			      //为后端传输字段  时间  动态
			      var timesdo = year + "-" + month + "-" + date;
			      this.formData.datas[0].date = timesdo;
			      // this.formData3.datas[0].date = timesdo;
				  
			    } else if (i === 1) {
			      str = "明天";
			    }
			    this.times.push({time: month + "-" + date, week: str});
			  }
			  console.log(this.times);
			},
			// 页面请求数据
			loadData(){
				uni.request({
					url:this.$ip.url.ip1 + "/app/menmian-area/4QAAAAEBAB4/AQYX4011",
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
						this.data = datas[0];
						this.workdates = datas[0].workdates;
						this.workdatesItem = this.workdates[this.workdatesIndex]
					}
				})
			},
			// 切换tab
			tabChange(index){
				this.TabCur = index;
				console.log(this.TabCur);
				if(index){ // 科目三
					this.formData.datas[0].subject = 3
					this.loadData()
				}else { // 科目二
					this.formData.datas[0].subject = 2
					this.loadData()
				}
			},
			// 切换星期
			tabDate(index){
				this.workdatesIndex = index
				this.workdatesItem = this.workdates[this.workdatesIndex]
				console.log(this.workdates);
				console.log(this.workdatesItem)
			}
		}
	}
</script>

<style>
	page{
		background-color: #F8F8F8;
	}
	.box {
		padding: 30upx 30upx 0;
	}
	/* 信息区域 */
	.header-info,
	.bottom-list{
		padding: 30upx;
		border-radius: 20upx;
		background-color: #FFFFFF;
		box-shadow: 0 4upx 30upx #ebedf0;
		margin-bottom: 30upx;
	}
	.bottom-list {
		padding: 0 20upx 20upx;
	}
	.header-one {
		display: flex;
		justify-content: space-between;
		padding-bottom: 16upx;
	}
	.header-one view:nth-child(1){
		display: flex;
	}
	.header-one view:nth-child(1) image {
		width: 40upx;
		height: 34upx;
		display: block;
		margin-right: 6upx;
	}
	.header-one view:nth-child(1) text {
		font-size: 24upx;
		color: #a1a1a1;
	}
	.header-one view:nth-child(2) {
		color: rgba(0,0,0,.87);
		font-size: 24upx;
	}
	.header-two {
		display: flex;
		align-items: center;
	}
	.header-two view:nth-child(1) image{
		width: 130upx;
		height: 130upx;
		margin-right: 20upx;
	}
	.header-two-right view:nth-child(1) text:nth-child(1){
		font-size: 32upx;
		font-weight: 700;
		margin-right: 10upx;
	}
	.header-two-right view:nth-child(1) text:nth-child(2){
		font-size: 24upx;
		color: #FFFFFF;
		background-color: #7ad5c3;
		padding: 0 6upx;
	}
	.header-two-right view:nth-child(2) {
		font-size: 24upx;
		color: rgba(0,0,0,.87);
	}
	/* 排班模块 */
	/* tab */
	.my-tab {
		width: 100%;
		text-align: center;
		font-size: 32upx;
		margin-bottom: 30upx;
	}
	.date-list {
		display: flex;
		justify-content: center;
	}
	.date-list>view {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.date-list>view text:nth-child(1) {
		font-size: 24upx;
		font-weight: 700;
	}
	.date-list>view text:nth-child(2) {
		font-size: 24upx;
		color: rgba(0,0,0,.87);
		padding-bottom: 18upx;
		padding-top: 4upx;
	}
	.date-list>view .isFlag {
		color: orange!important;
		border-bottom: 2upx solid orange;
	}
	.date-list-item {
		display: flex;
		flex-wrap: wrap;
		padding-top: 30upx;
	}
	.pad-rig {
		width: 33%;
		padding: 0px 6px;
		box-sizing: border-box;
		margin-bottom: 6px;
	}
	.item-list {
		font-size: 24upx;
		width: 100%;
		border: 2upx solid #ccc;
		border-radius: 20upx;
		text-align: center;
		padding: 16upx 0;
	}
	.bottom-list .footer {
		color: red;
		font-size: 24upx;
		padding: 30upx 0 10upx;
	}
</style>
