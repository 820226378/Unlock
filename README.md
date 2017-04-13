# Unlock
360前端星的一个作业，模仿手机上九宫格解锁
#任务思路
###刚看到任务要求时，第一反应就是需要用到HTML5的canvas来进行绘画这些圆点和连线，然后又看到要求是在移动端使用，所以核心事件就是touch事件，所有的操作用这个事件就可以完成。
###1. 我第一步是先用canvas画出解锁的几个圆，然后根据canvas的宽度大概计算了一个合适的r值，然后使用一个数组存储每个圆的圆心坐标和圆的序号，序号的作用主要是为了辨认链接顺序。
###2. 画好圆之后就给canvas绑定touch事件，这里主要用到了touchstart事件，touchmove事件，touchend事件，当canvas的touchstart事件触发后，首先要获取到触摸点的相对于canvas的坐标，然后和每个圆的圆心坐标相减，如果得到的值的绝对值小于圆的半径，则开始设置解锁图案，如果大于半径，则是无效触摸，为了让之后的touchmove事件辨认是否开始设置解锁图案，我设置了了一个flag，如果开始设置，则设置为true，否则为false。如果开始设置了，则需要给当前圆canvas画上圆心，为了之后视图更新，使用了两个数组，一个数组用来存储已经选择的圆节点信息，另外一个数组用来存储剩余的圆节点信息，因为一个圆不能重复链接。
###3. touchomve事件主要是为了随时更新视图，如果flag为true的话，就更新视图，否则不更新，更新视图主要是更新节点到触摸点的连线，但是因为canvas是画的，所以每次都需要将画布重新清空，然后重新进行绘画，所以在更新函数里需要用clearRect清除内容，然后重新画圆，但是还需要注意的一点是需要将之前选择的节点也要重新绘画圆心和按照选择顺序连线，然后将最后一个节点和当前触摸点连线，同时也需要判断当前触摸点是否在其他剩余的圆内，如果在剩余的圆内，则新加一个选择节点，否则就是单纯的连线
###4. touchend事件触发后，先判断触摸标志flag，如果为true，且是第一次选择，如果选择的节点数多于4个，就先将此选择的节点数组保存到一个数组中，然后将次数设置为1，并且初始化界面，和已选择的数组，还有未选择的数组，还有flag标志，并提示再次输入，当用户再次触发此事件，且满足之前条件时，判断此时的选择数组和之前保存的数组数据是否一致，若一致，则保存在localStorage中，然后初始化所有数据，提示用户进行解锁。
###5. 用户选择后，同之前数组进行比较，如果选择的节点数量和序号一样，则提示解锁成功，否则解锁失败
###6. 选择重新设置密码，需要将所有数组和标志都重新初始化，并且删除localStorage中存储的数据，然后重新进行设置
###7. 在初始页面对localStorage进行数据读取，如果已经有解锁数据，则提示用户验证，不需要重新设置，除非用户选择重新设置
###8. 基本功能做完了，发现页面并不是多美观，然后便仿照手机的解锁页面进行设计，将当前时间和日期都显示出来，并且将单选按钮做了一个好看的样式，而且当解锁成功和设置成功的时候圆的边会变成绿色，失败变成红色，更加相似与手机自带的解锁功能
###9. 唯一美中不足的就是，我canvas的半径计算和坐标都是在网上看的，并不是自己计算的，并且发现我自己的代码风格不是很好，希望能通过前端星培训使自己有长足的进步。

