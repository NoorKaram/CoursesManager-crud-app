const url = "https://69b4df7ebe587338e714798c.mockapi.io/courses"
let currentId = null

class Course {
    constructor(title, price, instructor, desc) {
        this.title = title
        this.price = price
        this.instructor = instructor
        this.desc = desc
    }
}

class CourseUi {
    static async getCourses() {
        let res = await fetch(url)
        return res.json()
    }

    static async getCourseID(id) {
        let res = await fetch(`${url}/${id}`)
        return res.json()
    }

    static async showCourses() {
        document.querySelector('tbody').innerHTML = '' // ✅ add this

        let courses = await CourseUi.getCourses()

        let tbody = document.querySelector('tbody')
        for (let course of courses) {
            let tr = document.createElement('tr')
            tr.innerHTML = `
                <td>${course.title}</td>
                <td>${course.price}</td>
                <td>${course.instructor}</td>
                <td class="desc-cell">${course.desc}</td>
                <td>
                    <button class="btn-delete" onclick="CourseUi.deleteCourse('${course.id}')">Delete</button>
                </td>
                <td>
                    <button class="btn-edit" onclick="CourseUi.updateCourse('${course.id}')">update</button>
                </td>
            `
            tbody.appendChild(tr)
        }
    }

    static async addCourse(event) {
        event.preventDefault()

        let title = document.querySelector('#title').value
        let price = document.querySelector('#price').value
        let instructor = document.querySelector('#instructor').value
        let desc = document.querySelector('#desc').value
        let course = { title, price, instructor, desc }

        if (!title || !price || !instructor || !desc) {
            Swal.fire({
                title: "Oops!",
                text: "All fields are required",
                icon: "error"
            });
        }
        else if (Number(price) < 1000) {
            Swal.fire({
                title: "Oops!",
                text: "The price must be atleast 1000 LE",
                icon: "error"
            });
        }
        else {
            await fetch(url, {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify(course)
            })

            await Swal.fire({
                title: "Added!",
                text: "Course added succesfully",
                icon: "success",
                confirmButtonText: "OK"
            })

            CourseUi.showCourses()
            document.querySelector('form').reset()
        }
    }


    static deleteCourse(id) {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to undo this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!"
        }).then(async(result) => {
            if (result.isConfirmed) {
                await fetch(`${url}/${id}`, {
                    method: "DELETE"
                })

                await Swal.fire({
                    title: "Deleted!",
                    text: "Course deleted successfully",
                    icon: "success",
                })

                CourseUi.showCourses()
            }
        })
    }


    static async updateCourse(id) {
        let course = await CourseUi.getCourseID(id)

        document.querySelector('#title').value = course.title
        document.querySelector('#price').value = course.price
        document.querySelector('#instructor').value = course.instructor
        document.querySelector('#desc').value = course.desc
        //disable the submit button & enable the update button
        currentId = course.id
        document.querySelector('#updateBtn').disabled = false
        document.querySelector('#submitBtn').disabled = true
    }

    static async saveUpdates() {
        let title = document.querySelector('#title').value
        let price = document.querySelector('#price').value
        let instructor = document.querySelector('#instructor').value
        let desc = document.querySelector('#desc').value

        let updatedCourse = { title, price, instructor, desc }

        await fetch(`${url}/${currentId}`, {
            method: "PUT",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(updatedCourse)
        })

        await Swal.fire({
            title: "Updated!",
            text: "Course updated successfully",
            icon: "success"
        })
    
        CourseUi.showCourses()
        document.querySelector('form').reset()
        //return the buttons to thier original state(submit enabled & update disabled)
        document.querySelector('#updateBtn').disabled = true
        document.querySelector('#submitBtn').disabled = false
        
    }
}


document.addEventListener('DOMContentLoaded', CourseUi.showCourses)

document.querySelector('form')
    .addEventListener('submit', (event) => CourseUi.addCourse(event))


document.querySelector('#updateBtn')
    .addEventListener('click', () => CourseUi.saveUpdates())

