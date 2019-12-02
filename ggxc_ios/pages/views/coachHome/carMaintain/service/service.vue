<template>
	<view class="box">
		<view class="form-box">
			<view>
				<text>车牌号：</text>
				<input type="text" value="" placeholder="请输入车牌号"/>
			</view>
			<view>
				<text>教练名称：</text>
				<input type="text" v-model.lazy="formData.datas[0].coach" placeholder="请输入教练名称"/>
			</view>
			<view>
				<text>报修金额：</text>
				<input type="text" v-model.lazy="formData.datas[0].money"  placeholder="请输入报修金额"/>
			</view>
			<view>
				<text>报修部件：</text>
				<input type="text" v-model.lazy="formData.datas[0].part"  placeholder="请输入具体哪个部位"/>
			</view>
			<view>
				<text>是否维修：</text>
				<view style="width: 74%; margin: auto;">
					<xfl-select 
					v-model="formData.datas[0].wxstate"
					:list="list"
					:initValue="'待维修'"
					:isCanInput="false"  
					:clearable="false"
					:style_Container="listBoxStyle"
					@change="selectChange"
					>
					</xfl-select>
				</view>
			</view>
			<view>
				<text>选择报修时间</text>
				<view>
					<uni-calendar
					v-model="formData.datas[0].date"
					ref="calendar"
					:insert="false"
					@confirm="confirm"
					 ></uni-calendar>
					 <text @click="open">{{isCalendar ? '打开日历' : calendarDate}}</text>
				</view>
			</view>
			<view class="lash">
				<text>报修原因：</text>
				<textarea placeholder="请输入报修原因" v-model="formData.datas[0].wxyy"></textarea>
			</view>
		</view>
		<view class="subBtn-box">
			<button @click="service()">提交</button>
		</view>
	</view>
</template>

<script>
	import xflSelect from '@/components/xfl-select/xfl-select.vue';
	import uniCalendar from "@/components/uni-calendar/uni-calendar";
	export default {
		components: { xflSelect,uniCalendar },
		data(){
			return {
				listBoxStyle: `height: 80upx;`,
				list: [	//要展示的数据
					'待维修',
					'已维修'
				],
				// 日历显示
				isCalendar:true,
				calendarDate:'',
				//接口 add_vehicleRepair
				formData: {
				  datas: [
				    {
						uid:"",
						schoolcode:"",  //驾校编码
						cphm: "", //车牌号
						coach: "", //教练名称
						money:"", //报修金额
						wxyy:"",  //报修原因
						//sum: "",
						date: "", //报修时间
						part: "", //更换部件
						wxstate:"0", //待维修 已维修
				    }
				  ]
				},
				// 查询车牌号
				formData02: {
				  datas: [
				    {
				      uid: "",
				      schoolcode: ""
				    }
				  ]
				},
				
			}
		},
		created() {
			//如果没有这句代码，select中初始化会是空白的，默认选中就无法实现
			// this.formData.datas[0].wxstate = this.couponList[0].id;
			//接口 add_vehicleRepair
			this.datas = JSON.parse(uni.getStorageSync('datas'));
			this.formData.datas[0].id = this.datas[0].id;    
			this.formData.datas[0].uid = this.datas[0].uid;
			//console.log(this.datas);
		    this.formData.datas[0].schoolcode = this.datas[0].userapps[0].schoolcode;
			//接口 car
			this.formData02.datas[0].uid = this.datas[0].uid;
			this.formData02.datas[0].schoolcode = this.datas[0].userapps[0].schoolcode;
		},
		methods:{
			// 选择框发生变化时
			selectChange({index, orignItem}){ 
				this.formData.datas[0].wxstate = index
			},
			// 打开日历
			open(){
				this.$refs.calendar.open();
			},
			// 日历选择后
			confirm(e) {
				this.calendarDate = e.fulldate
				this.formData.datas[0].date = e.fulldate
				this.isCalendar = false
				console.log(this.calendarDate);
			},
			// 提交
			service(){
				console.log(this.formData)
			}
			
		}
	}
</script>

<style>
	page{
		padding: 0 30upx;
		box-sizing: border-box;
	}
	.box {
		padding: 30upx 0;
	}
	.form-box>view {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 28upx;
		padding: 30upx 10upx;
		border-bottom: 2upx solid #E9E9E9;
	}
	.form-box>view text {
		flex: 1;
	}
	.form-box>view input {
		width: 74%;
		font-size: 28upx;
	}
	.form-box .lash {
		align-items: flex-start;
		flex-direction: column;
		border: none;
	}
	.form-box .lash textarea{
		width: 100%;
		font-size: 28upx;
		border: 2upx solid #ccc;
		border-radius: 10upx;
		height: 180upx;
		margin-top: 20upx;
		padding: 14upx;
		box-sizing: border-box;
	}
	.subBtn-box {
		padding: 30upx 0;
	}
	.subBtn-box button{
		background-color: #00BB99;
		/* border-radius: 60upx; */
		color: #FFFFFF;
	}
</style>
