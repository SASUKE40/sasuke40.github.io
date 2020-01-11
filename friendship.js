const friendship = []
const push = (name, url, image = '', description = '') =>
  friendship.push({ name, url, image, description })

push('Himself65', 'https://www.himself65.com/', 'himself65.jpg')
push('ice1000', 'https://ice1000.org', 'ice1000.jpg')
push('DIYgod', 'https://diygod.me/', 'DIYgod.jpg')
push('太狼', 'https://lynvv.xyz', 'lynvv.jpg')
push('木子', 'https://blog.502.li', 'muzi502.png')
push('隔雨听竹', 'https://blog.bobguo.top', 'bob.jpg')

module.exports = friendship
