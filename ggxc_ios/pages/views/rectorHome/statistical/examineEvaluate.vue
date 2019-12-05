<template>
	<view class="box">
		
		<view class="list-box">
			<block v-for="(item,index) in listDatas" :key="index">
				<view class="item-box">
					<view class="item-box-one">
						<view>
							<text>{{item.coach}}</text>
							<text>教练姓名</text>
						</view>
						<view>
							<text>{{item.coach_phone}}</text>
							<text>教练电话</text>
						</view>
						<view>
							<text>{{item.student}}</text>
							<text>学员姓名</text>
						</view>
						<view>
							<text>{{item.stu_phone}}</text>
							<text>学员电话</text>
						</view>
					</view>
					<view class="item-box-two">
						<text>{{item.date}}</text>
						<block v-if="item.attitude>=0">
						    <uniRate size="14" :value="item.attitude" active-color="rgb(240, 37, 15)" margin="8"></uniRate>
						</block>
					</view>
				</view>
			</block>
		</view>
		
	</vie
	w>
</template>

<script>
	import uniRate from "@/components/uni-rate/uni-rate/uni-rate.vue"
	export default {
		components: { uniRate },
		data(){
			return {
				newDate: '', //当前的日期的信息
				ynow: '', //当前的年数
				mnow: '', //当前的月份
				date1: '', //当前的 2019-6
			  val:'1',
			  datas: [],
			  dialogShow:false,
			  isVisible: false,
			  defaultValueData: ['2012', '02'],
			
			  formData: {
			    datas: [
			      {
			        uid: '',
			        schoolcode: '',
			      }
			    ]
			  },
			
			  formData2: {
			    datas: [
			      {
			        uid: "",
			        dataid: "",
			        result: ""
			      }
			    ]
			  },
			
			  listDatas: [],
			  item: []
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
		  this.datas = JSON.parse(uni.getStorageSync('datas'));
		  this.formData.datas[0].date = this.date1
		  this.defaultValueData = this.formData.datas[0].date.split("-");
		  this.formData.datas[0].uid = this.datas[0].uid;
		  this.formData2.datas[0].uid = this.datas[0].uid;
		  this.formData.datas[0].schoolcode = this.datas[0].userapps[0].schoolcode;
		  this.loadData();
		},
		methods: {
			loadData(){
				uni.request({
					url:this.$ip.url.ip1 + "/app/menmian-area/4QAAAAEBAB4/EvaluateList",
					method:'post',
					data:JSON.stringify(this.formData),
					success: (res) => {
						let { data: { code, datas, msg } } = res;
						if(code!==200){
							uni.showToast({
								title: msg,
								icon:'none'
							})
							this.listDatas = []
							 return;
						}
						this.listDatas = datas;
						console.log(this.listDatas);
					}
				})
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
	.list-box {
		border-radius: 20upx;
		padding: 20upx;
	}
	.item-box {
		border: 2upx solid #ccc;
		border-radius: 20upx;
		margin-bottom: 20upx;
		overflow: hidden;
		background-color: #FFFFFF;
	}
	.item-box .item-box-one {
		padding: 24upx 30upx;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		text-align: center;
		font-size: 24upx;
		color: #828282;
	}
	.item-box .item-box-one>view {
		width: 50%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.item-box-one view text:nth-child(1) {
		color: #f87144;
		font-size: 30upx;
		font-weight: 700;
		margin-bottom: 4upx;
	}
	.item-box-one view:nth-child(odd) {
		padding-bottom: 10upx;
	}
	.item-box-one view:nth-child(odd) text:nth-child(1) {
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
	.item-box-two text:nth-child(2) {
		background-color: #00BB99;
		color: #FFFFFF;
		font-size: 30upx;
		padding: 6upx 12upx;
		border-radius: 10upx;
	}
	.isBgc {
		background-color: #bdbdbd!important;
	}
</style>
