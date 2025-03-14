document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const historyDropdown = document.querySelector('.history-dropdown');
    const historyList = document.getElementById('history-list');
    const clearHistoryButton = document.getElementById('clear-history');
    const searchButtons = document.querySelectorAll('.search-btn');
    const themeLight = document.getElementById('theme-light');
    const themeDark = document.getElementById('theme-dark');
    
    // 从本地存储加载搜索历史
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    
    // 从本地存储加载选中的搜索按钮
    let selectedSearchButton = localStorage.getItem('selectedSearchButton') || 'https://www.google.com/search?q=';
    
    // 加载主题设置
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeLight.classList.remove('active');
        themeDark.classList.add('active');
    }
    
    // 主题切换
    themeLight.addEventListener('click', function() {
        document.body.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
        themeLight.classList.add('active');
        themeDark.classList.remove('active');
    });
    
    themeDark.addEventListener('click', function() {
        document.body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
        themeLight.classList.remove('active');
        themeDark.classList.add('active');
    });
    
    // 渲染搜索历史
    function renderSearchHistory() {
        historyList.innerHTML = '';
        
        if (searchHistory.length === 0) {
            const emptyItem = document.createElement('li');
            emptyItem.textContent = '暂无搜索历史';
            emptyItem.style.color = 'var(--text-light)';
            emptyItem.style.textAlign = 'center';
            historyList.appendChild(emptyItem);
            return;
        }
        
        // 只显示最近的8条记录
        const recentHistory = searchHistory.slice(0, 8);
        
        recentHistory.forEach((item, index) => {
            const listItem = document.createElement('li');
            listItem.className = 'history-item';
            
            // 创建历史记录文本元素
            const textSpan = document.createElement('span');
            textSpan.className = 'history-text';
            textSpan.textContent = item;
            textSpan.addEventListener('click', function() {
                searchInput.value = item;
                historyDropdown.classList.remove('active');
            });
            
            // 创建删除按钮
            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-history';
            deleteButton.innerHTML = '✕';
            deleteButton.title = '删除此记录';
            deleteButton.addEventListener('click', function(e) {
                e.stopPropagation(); // 阻止事件冒泡
                deleteHistoryItem(index);
            });
            
            listItem.appendChild(textSpan);
            listItem.appendChild(deleteButton);
            historyList.appendChild(listItem);
        });
    }
    
    // 添加删除单个历史记录的函数
    function deleteHistoryItem(index) {
        searchHistory.splice(index, 1);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
        renderSearchHistory();
        
        // 如果历史记录为空,自动隐藏下拉框
        if (searchHistory.length === 0) {
            setTimeout(() => {
                historyDropdown.classList.remove('active');
            }, 300);
        }
    }
    
    // 添加搜索历史
    function addToHistory(query) {
        if (query.trim() === '') return;
        
        // 移除重复项
        searchHistory = searchHistory.filter(item => item !== query);
        
        // 添加到历史记录开头
        searchHistory.unshift(query);
        
        // 限制历史记录数量
        if (searchHistory.length > 20) {
            searchHistory.pop();
        }
        
        // 保存到本地存储
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    }
    
    // 清空搜索历史
    clearHistoryButton.addEventListener('click', function() {
        searchHistory = [];
        localStorage.removeItem('searchHistory');
        renderSearchHistory();
    });
    
    // 显示/隐藏历史记录 - 修改为点击搜索框时显示
    searchInput.addEventListener('click', function() {
        renderSearchHistory();
        historyDropdown.classList.add('active');
    });
    
    // 点击外部区域隐藏历史记录
    document.addEventListener('click', function(event) {
        if (!searchInput.contains(event.target) && !historyDropdown.contains(event.target)) {
            historyDropdown.classList.remove('active');
        }
    });
    
    // 更新选中的搜索按钮样式
    function updateSelectedButtonStyle() {
        // 移除所有按钮的选中样式
        searchButtons.forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // 为当前选中的按钮添加选中样式
        searchButtons.forEach(btn => {
            if (btn.getAttribute('data-url') === selectedSearchButton) {
                btn.classList.add('selected');
            }
        });
    }
    
    // 初始化选中的搜索按钮
    updateSelectedButtonStyle();
    
    // 搜索按钮点击事件
    searchButtons.forEach(button => {
        // 添加右键菜单事件
        button.addEventListener('contextmenu', function(e) {
            e.preventDefault(); // 阻止默认右键菜单
            
            const baseUrl = this.getAttribute('data-url');
            
            // 如果当前按钮已经被选中，则取消选中
            if (selectedSearchButton === baseUrl) {
                selectedSearchButton = 'https://www.google.com/search?q='; // 默认为Google
            } else {
                // 否则选中当前按钮
                selectedSearchButton = baseUrl;
            }
            
            // 保存选中状态到本地存储
            localStorage.setItem('selectedSearchButton', selectedSearchButton);
            
            // 更新按钮样式
            updateSelectedButtonStyle();
        });
        
        // 普通点击事件
        button.addEventListener('click', function() {
            const query = searchInput.value.trim();
            const baseUrl = this.getAttribute('data-url');
            
            // 添加点击动画效果
            this.classList.add('clicked');
            setTimeout(() => {
                this.classList.remove('clicked');
            }, 200);
            
            // 如果有输入内容，添加到历史记录
            if (query !== '') {
                addToHistory(query);
                // 打开带有搜索词的URL
                window.open(baseUrl + encodeURIComponent(query), '_blank');
            } else {
                // 没有输入内容，直接打开搜索引擎主页
                let domain = baseUrl;
                if (domain.includes('?')) {
                    domain = domain.split('?')[0];
                }
                if (domain.includes('/')) {
                    const thirdSlash = domain.indexOf('/', 8);
                    if (thirdSlash !== -1) {
                        domain = domain.substring(0, thirdSlash);
                    }
                }
                if (domain.includes('#/')) {
                    domain = domain.split('#/')[0];
                }
                
                window.open(domain, '_blank');
            }
        });
    });
    
    // 主搜索按钮点击事件 - 修改为使用选中的搜索引擎
    searchButton.addEventListener('click', function() {
        const query = searchInput.value.trim();
        
        if (query !== '') {
            addToHistory(query);
            window.open(`${selectedSearchButton}${encodeURIComponent(query)}`, '_blank');
        } else {
            // 获取选中搜索引擎的域名
            let domain = selectedSearchButton;
            if (domain.includes('?')) {
                domain = domain.split('?')[0];
            }
            if (domain.includes('/')) {
                const thirdSlash = domain.indexOf('/', 8);
                if (thirdSlash !== -1) {
                    domain = domain.substring(0, thirdSlash);
                }
            }
            if (domain.includes('#/')) {
                domain = domain.split('#/')[0];
            }
            
            window.open(domain, '_blank');
        }
    });
    
    // 回车键搜索 - 修改为使用选中的搜索引擎
    searchInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            searchButton.click();
        }
    });
    
    // 设置焦点到搜索框
    searchInput.focus();
    
    // 处理图标加载失败的情况
    document.querySelectorAll('.search-icon').forEach(img => {
        if (img.tagName === 'IMG') {
            img.onerror = function() {
                // 创建一个简单的文本替代图标
                const span = document.createElement('span');
                span.className = 'text-icon';
                span.textContent = img.alt.charAt(0);
                img.parentNode.replaceChild(span, img);
            };
        }
    });

    // 添加滚动事件监听
    let lastScrollTop = 0;
    const header = document.querySelector('header');
    const scrollThreshold = 50;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        
        // 添加阴影效果
        if (currentScroll > scrollThreshold) {
            header.classList.add('header-shadow');
        } else {
            header.classList.remove('header-shadow');
        }

        lastScrollTop = currentScroll;
    });
});

// 添加点击动画和选中按钮样式CSS
document.head.insertAdjacentHTML('beforeend', `
<style>
.search-btn.clicked {
    transform: scale(0.95);
}

.text-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    background-color: currentColor;
    color: white;
    border-radius: 50%;
    font-size: 10px;
    font-weight: bold;
}

.search-btn.selected {
    background: linear-gradient(to bottom, rgba(var(--primary-rgb), 0.1), rgba(var(--primary-rgb), 0.15)) !important;
    border: 1px solid rgba(var(--primary-rgb), 0.3) !important;
    box-shadow: 0 2px 10px rgba(var(--primary-rgb), 0.15) !important;
    position: relative;
    overflow: hidden;
}

.search-btn.selected::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(to right, var(--primary-light), var(--primary-color));
    border-radius: 0 0 12px 12px;
}

.search-btn.selected span {
    color: var(--primary-dark);
    font-weight: 600;
}

.dark-theme .search-btn.selected {
    background: linear-gradient(to bottom, rgba(255, 123, 58, 0.15), rgba(255, 123, 58, 0.2)) !important;
    border: 1px solid rgba(255, 123, 58, 0.3) !important;
    box-shadow: 0 2px 10px rgba(255, 123, 58, 0.15) !important;
}

.dark-theme .search-btn.selected span {
    color: var(--primary-light);
}

.header-shadow {
    box-shadow: 0 4px 20px rgba(var(--primary-rgb), 0.1);
}

.dark-theme .header-shadow {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}
</style>
`); 