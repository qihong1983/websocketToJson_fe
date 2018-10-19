/**
 * 引入公共文件开始
 */
import React, {
	Component
} from 'react';


import {
	Layout,
	Table,
	Card,
	Menu,
	notification,
	Form,
	Select,
	Input,
	Button
} from 'antd';

const {
	TextArea
} = Input;

const FormItem = Form.Item;
const Option = Select.Option;

const {
	Header,
	Footer,
	Sider,
	Content
} = Layout;


import Head from 'next/head'; // 引入内置组件
import Link from 'next/link';



import NProgress from 'nprogress';

import {
	withRouter
} from 'next/router';

import withRedux from 'next-redux-wrapper';

import {
	connect
} from 'react-redux';


import {
	bindActionCreators
} from 'redux';

//socket.io api
import io from 'socket.io-client';


import initializeStore from '../store/initializeStore';
import * as actionCreators from './actions';

/**
 * 引入公共文件结束
 */

class About extends Component {
	static async getInitialProps({
		query,
		store,
		isServer
	}) {

		if (isServer == false) {
			NProgress.start();
		}
		let data = store.getState();

		let params = {
			limit: data.limit,
			offset: 1
		}
		await store.dispatch(actionCreators.getTablesNoData(params));

	}

	constructor(props) {
		super(props);
	}

	componentWillMount() {
		// socket.io引入成功后，可通过io()生成客户端所需的socket对象。
		let socket = io('http://localhost:3000');

		console.log(socket, 'aa');

		// socket.emmit()用户客户端向服务端发送消息，服务端与之对应的是socket.on()来接收信息。
		socket.emit('clientmessage/1234', {
			msg: 'hi, server'
		});
	}

	componentDidMount() {

		// NProgress.done();

		if (document !== undefined) {
			NProgress.done();
		}



	}


	addKey(data, str) {
		var arr = [];

		data.map((v, k) => {
			v.key = str + k;
			arr.push(v);
		});

		return arr;
	}

	handleTableChange(pagination, filters, sorter) {
		let params = {
			offset: pagination.current,
			limit: pagination.pageSize
		}

		this.props.getTablesNoData(params);
	}

	handleSubmit(e) {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				console.log('Received values of form: ', values);

				// socket.io引入成功后，可通过io()生成客户端所需的socket对象。
				let socket = io('http://localhost:3000');


				socket.emit('admin', {
					msg: {
						userid: '1234',
						content: values
					}
				});

				console.log(this.props.form.resetFields());

				this.props.form.resetFields();

				// notification['success']({
				// 	message: '发送成功',
				// 	description: '以前标题和内容发送给客户端',
				// });

				// socket.on('client/1234', function(obj) {
				// 	console.log(obj, 'aaaa');
				// })
			}
		});
	}

	handleSelectChange(value) {
		console.log(value);
		this.props.form.setFieldsValue({
			note: `Hi, ${value === 'male' ? 'man' : 'lady'}!`,
		});
	}

	render() {

		var pagination = {
			current: this.props.about.offset,
			pageSize: this.props.about.limit,
			total: this.props.about.total
		}

		this.addKey(this.props.about.tableData, 'about' + new Date().getTime());

		const {
			getFieldDecorator
		} = this.props.form;
		return (
			<div>
				<Head>
	         		<title>通知和通知提醒后台页面</title>
	         		<meta name="viewport" content="initial-scale=1.0, width=device-width"/>
	      			<link rel="stylesheet" href="/static/antd.css" />
	      		</Head>
	      		<Layout>
	      			<Header style={{color:"white"}}>
						<div className="logo" >websocket json文本传输</div>
				      <Menu
				        theme="dark"
				        mode="horizontal"
				        selectedKeys={['2']}
				        style={{ lineHeight: '64px' }}
				      >
				        <Menu.Item key="1"><Link href='/'><a>前台页面</a></Link></Menu.Item>
				        <Menu.Item key="2">后台页面</Menu.Item>
				      </Menu>
					</Header>
					<Content>
						<div style={{ background: '#f2f2f2', padding: '30px' }}>
					    	<Card title="兼容firefox和chrome和主流现代浏览器(用chrome或firefox打开)" bordered={false}>
								<Form onSubmit={this.handleSubmit.bind(this)}>
							        <FormItem
							          label="标题"
							          labelCol={{ span: 5 }}
							          wrapperCol={{ span: 12 }}
							        >
							          {getFieldDecorator('note', {
							            rules: [{ required: true, message: '请输入标题' }],
							          })(
							            <Input placeholder="发送的标题" />
							          )}
							        </FormItem>
							        <FormItem
							          label="内容"
							          labelCol={{ span: 5 }}
							          wrapperCol={{ span: 12 }}
							        >
							          {getFieldDecorator('gender', {
							            rules: [{ required: true, message: '请输入内容' }],
							          })(
							             <TextArea placeholder="发送的内容" autosize={{ minRows: 2, maxRows: 6 }} />
							          )}
							        </FormItem>
							        <FormItem
							          wrapperCol={{ span: 12, offset: 5 }}
							        >
							          <Button type="primary" htmlType="submit">
							            发送
							          </Button>
							        </FormItem>
							      </Form>
	  						</Card>
	  					</div>
			        </Content>
	      		</Layout>
	        </div>
		)
	}
}

//将state.counter绑定到props的counter
const mapStateToProps = (state) => {
	return {
		about: state.About
	}
};

//将action的所有方法绑定到props上
const mapDispatchToProps = (dispatch, ownProps) => {
	//全量
	return bindActionCreators(actionCreators, dispatch);
};

About = connect(mapStateToProps, mapDispatchToProps)(About);

About = withRedux(initializeStore)(About);

About = Form.create()(About);

export default withRouter(About);