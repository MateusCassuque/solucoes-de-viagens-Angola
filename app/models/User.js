class User{
    static count = 0

    constructor(user){
        User.count ++

        this.id = User.count
        this.name = user.name
        this.email = user.email
        this.senha = user.senha

      this.createdAte = new Date()

    }
}
module.exports = User