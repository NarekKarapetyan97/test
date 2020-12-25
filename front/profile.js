const user = JSON.parse(window.localStorage.getItem('userset'))
if (user === null) window.location.href = './index.html'
showname.innerHTML = user.name

window.onload = () => {
    fetch(`http://localhost:5001/online`)
        .then((data) => data.json())
        .then(console.log)
        .catch(console.log)
}

logout.onclick = () => {
    window.localStorage.clear('userset')
    window.location.href = 'index.html'
}
