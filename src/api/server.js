// Welcome to the tutorial!
import {
  createServer,
  Model,
  hasMany,
  belongsTo,
  RestSerializer,
  Factory,
  trait
} from 'miragejs'

export default function () {
  createServer({
    factories: {
      user: Factory.extend(
        {
          name(i) {
            return `User${i}`;
          }
        }
      ),
      star: Factory.extend(
        {
          weekStart(i) {
            return `${
              i * 7 + 1
            }-06-21`
          },
          status(i) {
            return `Open`
          },
          userId(i) {
            return `${i}`
          },
          withTasks: trait(
            {
              afterCreate(star, server) {
                server.createList('task', 5, {star})
              }
            }
          )
        }
      ),
      task: Factory.extend(
        {
          project(i) {
            return `Project-${i}`
          },
          module(i) {
            return `Module-${i}`
          },
          sprint(i) {
            return `Sprint-${i}`
          },
          task(i) {
            return `Task-${i}`
          },
          taskNotes(i) {
            return `TaskNotes-${i}`
          },
          hours(i) {
            return `${
              i + 4
            }`
          },
          date(i) {
            return `${
              i * 7 + 1
            }-06-21`
          }
        }
      )
    },
    serializers: {
      application: RestSerializer,
      star: RestSerializer.extend(
        {include: ['tasks'], embed: true}
      )
    },
    models: {
      user: Model.extend(
        {stars: hasMany()}
      ),
      star: Model.extend(
        {user: belongsTo(), tasks: hasMany()}
      ),
      task: Model.extend(
        {star: belongsTo()}
      )
    },
    seeds(server) {
      let user = server.create("user");
      user.save()
      console.log(user.id)
      server.createList("star", 5, "withTasks", {userId: user.id})

    },
    routes() {
      this.namespace = 'api'
      this.get("/stars/:userId", (schema, request) => {
        console.log('In server getting reports')

        let userId = request.params.userId
        let stars = schema.stars.where({"userId": userId})
        return stars
      })
      this.get("/tasks/:starId", (schema, request) => {
        console.log('In server getting tasks')

        let starId = request.params.starId
        let star = schema.stars.find(starId)
        let taskList = star.tasks
        return taskList
      })
      this.post("/tasks", (schema, request) => {
        let starId = request.params.starId
        let attrs = JSON.parse(request.requestBody)
        //console.log(attrs)
        //console.log(schema.tasks)
        
        return schema.tasks.create(attrs)
      })
      this.post("/tasks/:taskId", (schema, request) => {
        let taskId = request.params.taskId
        let post=schema.tasks.find(taskId)
        let attrs = JSON.parse(request.requestBody)
        post.update(attrs)
        //console.log(attrs)
        //console.log(schema.tasks)
        return post//schema.tasks.create(attrs)
      })
      this.post("/stars", (schema,request)=>{
        let starId=JSON.parse(request.requestBody).id
        let star = schema.stars.find(starId).update({status:"Closed"})
        return star
      })
    }
  })
}
