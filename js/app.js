;(function(){
	//使用自定义属性 第一个参数是名字 可以自定义
	// Vue.directive 是全局自定义属性
	Vue.directive('focus', {
  // inserted 方法 当页面初始化时就会被触发
  inserted: function (el) {
    // el 是元素本身
		// focus() 函数可以给某个元素获得焦点
    el.focus()
  }
})
	window.app = new Vue({

		data: {
			todos: JSON.parse(localStorage.getItem('todos') || '[]'),
			currentTodo: null,
			filterText: 'all'
		},
		watch: {
			todos: {
				handler: function(val) {
					localStorage.setItem('todos', JSON.stringify(val))
				},
				deep: true
			}
		},
		//计算属性
		computed: {
			// 定义函数可以模板中调用这个函数
			// 并且在模板中的值是动态的
			todosComplted: function () {
			return this.todos.filter(function(item) {
					return item.completed == false
				}).length
			},
			//根据锚点变化来显示todos
			todosFilter: function () {
				switch (this.filterText) {
					case 'active':
						return this.todos.filter(function(item) {
								return !item.completed
							})
						break
					case 'completed':
						return this.todos.filter(function(item) {
								return item.completed
							})
						break
					default:
						return this.todos
						break
				}
			},

			checkedTodos: function () {
				// every 方法表示
				// 当遍历的元素中 如果有一项不匹配条件
				// 那么就会返回fallse
				// 反之 必须全部项符合才能返回true
				return this.todos.every(function(item){
					return item.completed == true
				})
			}
		},
		// 局部 自定义属性
		directives: {
		  edit: {
		    // 指令的定义
		    update: function (el) {
					el.focus()
		    }
		  }
		},
		methods: {
			addTodos: function(e) {
				//input框中敲回车键 添加todo
				var self = e.target
				var value = self.value.trim()
				if (!value.length) {
					return
				}
				this.todos.push({
					id: this.todos.length ? this.todos[this.todos.length - 1].id + 1 : 1,
					name: value,
					completed: false
				})
				//清空文本框
				self.value = ''
			},
			todoToggle: function(e) {
				//获得隐藏的复选框中的 checked 这里的checked是从dom中拿到的
				var checked = e.target.checked
				// 遍历所有的todos 并让所有的completed 都变成复选框的状态
				this.todos.forEach(function(item) {
					item.completed = checked
				})
			},
			removeTodo: function(index) {
				this.todos.splice(index, 1)
			},
			editTodo: function(item) {
				this.currentTodo = item
			},
			saveTodo: function(index, item, e) {
				//保存编辑后的todos
				var self = e.target
				var value = self.value.trim()
				if (!value.length) {
					this.removeTodo(index)
					return
				}
				this.todos[index].name = value
				//清除样式
				this.editTodo(null)
			},
			cancelEditTodo: function() {
				this.editTodo(null)
			},
			clearCompletedTodo: function() {
				for (var i = 0; i < this.todos.length; i++) {
					var todo = this.todos[i]
					if (todo.completed == true) {
						this.todos.splice(i, 1)
						i--
					}
				}
			}

		}

	}).$mount('#app')

// onhashchange事件是当页面锚点进行改变时触发
	window.onhashchange = function () {
		// 触发后把vue实例中定义的 filterText 的值变成当前锚点的值
		app.filterText = location.hash.replace('#/','')
	}
	//页面初始化一上来就调用一次这个事件 那么也就实现了样式的还原以及页面的还原
	window.onhashchange()
})()
