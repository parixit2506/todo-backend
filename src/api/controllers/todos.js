const { Todo } = require("../../database/models"); 
const { User } = require("../../database/models"); 

const createTodo = async (req, res) => {
    try {        
        const userId = req.user.id;
        const user = await User.findByPk(userId);
        
        const { title, description } = req.body;
        
        if (user.isDeleted) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        if (!req.user || !userId) {
            return res.status(401).json({ success: false, message: "Unauthorized: User not authenticated." });
        }

        if (!title) {
            return res.status(422).json({ success: false, message: "Title is required." });
        }
        
        const newTodo = await Todo.create({
            title,
            description,
            userId: req.user.id, 
        });
        
        res.status(201).json({
            success: true,
            message: "Todo created successfully",
            result: newTodo,
        });
        
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

const getTodos = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findByPk(userId);

        if (user.isDeleted) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        const todos = await Todo.findAll({
            where: { 
                isDeleted: false,
                userId: req.user.id 
            },
        });

        res.status(200).json({
            success: true,
            message: "Todos fetched successfully",
            result: todos,
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}   

const getTodoById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const user = await User.findByPk(userId);

    if (!user || user.isDeleted) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const todo = await Todo.findByPk(id);

    if (!todo || todo.isDeleted) {
      return res.status(404).json({ success: false, message: "Todo not found." });
    }

    if (todo.userId !== userId) {
      return res.status(403).json({ success: false, message: "Unauthorized." });
    }

    res.status(200).json({
      success: true,
      message: "Todo fetched successfully",
      result: todo,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const updateTodo = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findByPk(userId);

        if (user.isDeleted) {
            return res.status(404).json({ success: false, message: "User not found." });
        }   

        const { id } = req.params;
        const { title, description } = req.body;

        const todo = await Todo.findByPk(id);

        if (!todo) {
            return res.status(404).json({ success: false, message: "Todo not found." });
        }

        if (todo.userId !== userId) {
            return res.status(403).json({ success: false, message: "You are not authorized to update this todo." });
        }

        if (todo.isDeleted) {
            return res.status(400).json({ success: false, message: "Cannot update a deleted todo." });
        }

        const updatedData = {
            title: title || todo.title, 
            description: description,
        };

        if (title) updatedData.title = title;
        // if (description) updatedData.description = description;

        await todo.update(updatedData);

        res.status(200).json({
            success: true,
            message: "Todo updated successfully",
            result: todo,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}   

const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findByPk(id);
    const userId = req.user.id;
    const user = await User.findByPk(userId);

    if (!user || user.isDeleted) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    if (!todo) {
      return res.status(404).json({ success: false, message: "Todo not found." });
    }

    if (todo.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized." });
    }

    if (todo.isDeleted) {
      return res.status(400).json({ success: false, message: "Todo is already deleted." });
    }

    todo.deletedAt = new Date();
    todo.isDeleted = true;
    await todo.save();

    res.status(200).json({
      success: true,
      message: "Todo deleted successfully",
      result: todo,
    });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


module.exports = {
    createTodo,
    getTodos,
    updateTodo,
    deleteTodo,
    getTodoById
};