const express = require("express");
var bodyParser = require("body-parser");

//Database
const database = require("./database");


//Initialise express 

const booky = express(); 

booky.use(bodyParser.urlencoded({extended: true}));
booky.use(bodyParser.json());

/*
Route         /
Description   Get all the books
Access        PUBLIC
Parameter     NONE
Methods       GET
*/


booky.get("/",(req,res) => {
    return res.json({books: database.books});
});

/*
Route         /is
Description   Get specific book on ISBN
Access        PUBLIC
Parameter     ISBN
Methods       GET
*/

booky.get("/is/:isbn",(req,res) => {
    const getSpecificBook = database.books.filter(
        (book) => book.ISBN === req.params.isbn

    );

    if(getSpecificBook.length === 0) {
        return res.json({error: `No book found for the ISBN of ${req.params.isbn}`})
    }

    return res.json({book: getSpecificBook});
});

/*
Route         /c
Description   Get specific book on Category
Access        PUBLIC
Parameter     category
Methods       GET
*/

booky.get("/c/:category",(req,res) => {
    const getSpecificBook = database.books.filter(
        (book) => book.category.includes(req.params.category)
    )

    if (getSpecificBook.length === 0){
        return res.json({error: `NO book found for the category of ${req.params.category}`})
    }

    return res.json({book: getSpecificBook });
});

/*
Route         /author
Description   Get specific book on Languages
Access        PUBLIC
Parameter     Language
Methods       GET
*/

booky.get("/l/:language",(req,res) => {
    const getSpecificBook = database.books.filter(
        (book) => book.language.includes(req.params.language)
    )

    if (getSpecificBook.length === 0){
        return res.json({error: `NO book found for the language of ${req.params.language}`})
    }

    return res.json({book: getSpecificBook });
});



/*
Route         /author
Description   Get all authors
Access        PUBLIC
Parameter     None
Methods       GET
*/

booky.get("/author", (req,res) => {
    return res.json({authors: database.author});
});

/*
Route            /author/id
Description      get a specific author based on id
Access           PUBLIC
Parameter        id
Methods          GET
*/

booky.get("/author/id/:id", (req,res) => {
    const getSpecificAuthor = database.author.filter(
        (author) => author.id === parseInt(req.params.id)
    );
    if(getSpecificAuthor.length === 0){
        return res.json({error: `No Books found for the Author ${req.params.id}`});
    }
    return res.json({author: getSpecificAuthor});
});


/*
Route         /author/book
Description   Get all authors based on books
Access        PUBLIC
Parameter     ISBN
Methods       GET
*/

booky.get("/author/book/:isbn",(req,res) => {
    const getSpecificAuthor = database.author.filter(
        (author) => author.books.includes(req.params.isbn)

    )

    if (getSpecificAuthor.length === 0){
        return res.json({error: `NO author found for the book of ${req.params.isbn}`})
    }

    return res.json({authors: getSpecificAuthor});
});

/*
Route         /publication
Description   Get all publication
Access        PUBLIC
Parameter     NONE
Methods       GET
*/

booky.get("/publication",(req,res) =>{
    return res.json({publications: database.publication});
})

/*
Route         /publication/id
Description   Get a specific publication on books
Access        PUBLIC
Parameter     id
Methods       GET
*/

booky.get("/publication/id/:id",(req,res) => {
    const getSpecificPublication = database.publication.filter(
        (publication) => publication.id === parseInt(req.params.id)

    )

    if (getSpecificPublication.length === 0){
        return res.json({error: `NO Books found for the publication ID of ${req.params.id}`})
    }

    return res.json({publications: getSpecificPublication});
});


/*
Route         /publication/book
Description   Get a list of publications based on books
Access        PUBLIC
Parameter     ISBN
Methods       GET
*/

booky.get("/publication/book/:isbn",(req,res) => {
    const getSpecificPublication = database.publication.filter(
        (publication) => publication.books.includes(req.params.isbn)

    )

    if (getSpecificPublication.length === 0){
        return res.json({error: `NO publication found for the book of ${req.params.isbn}`})
    }

    return res.json({publication: getSpecificPublication});
});


//POST

/*
Route         /book/new
Description   Add new books
Access        PUBLIC
Parameter     NONE
Methods       POST
*/

booky.post("/book/new" ,(req,res) => {
    const newBook = req.body;
    database.books.push(newBook);
    return res.json({updatedBooks: database.books})
});

/*
Route         /author/new
Description   Add new authors
Access        PUBLIC
Parameter     NONE
Methods       POST
*/

booky.post("/author/new",(req,res) => {
    const newAuthor = req.body;
    database.author.push(newAuthor);
    return res.json(database.author);
});


/*
Route         /publication/new
Description   Add new publications
Access        PUBLIC
Parameter     NONE
Methods       POST
*/

booky.post("/publication/new", (req,res) => {
    const newPublication = req.body;
    database.publication.push(newPublication);
    return res.json(database.publication);

});

/*
Route         /publication/update/book
Description   Update/add new publications
Access        PUBLIC
Parameter     ISBN
Methods       PUT
*/

booky.put("/publication/update/book/:isbn", (req,res) => {
    //Update the publication database
    database.publication.forEach((pub) => {
        if(pub.id === req.body.pubId) {
            return pub.books.push(req.params.isbn);
         }
    });

    //Update the book database
    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn){
            book.publication = req.body.pubId;
            return;
        }
        });


    return res.json(
        {
            books: database.books,
            publication: database.publication,
            message: "Successfully updated publications"
        }
    );

});

/******DELETE*******/

/*
Route         /book/delete
Description   delete a book
Access        PUBLIC
Parameter     ISBN
Methods       DELETE
*/

booky.delete("/book/delete/:isbn", (req,res) => {
    //Whichever book that doesnot match with the isbn, just send it to an updatedBookDatabase Array
    //and rest will be filtered out

    const updatedBookDatabase = database.books.filter(
        (book) => book.ISBN !== req.params.isbn
    )
    database.books = updatedBookDatabase;

    return res.json({books: database.books});
});

/*
Route         /author/delete
Description   delete an author from book
Access        PUBLIC
Parameter     ISBN
Methods       DELETE
*/

booky.delete("/author/delete:isbn", (req,res) => {
    const updatedAuthorDatabase = database.author.filter(
        (author) => author.ISBN !== req.params.isbn
    )
    database.author = updatedAuthorDatabase;

    return res.json({authors: database.author});
});



/*
Route         /book/delete/author
Description   delelte author from book and vice versa
Access        PUBLIC
Parameter     ISBN, authorId
Methods       DELETE
*/

booky.delete("/book/delete/author/:isbn/:authorId", (req,res) => {
    //Update the book database
    database.books.forEach((book)=>{
        if(book.ISBN === req.params.isbn) {
            const newAuthorList = book.author.filter(
                (eachAuthor) => eachAuthor !== parseInt(req.params.authorId)
            );
            book.author = newAuthorList;
            return;
        }
    });


    //Update the author database
    database.author.forEach((eachAuthor) =>{
        if(eachAuthor.id === parseInt(req.params.authorId)) {
            const newBookList = eachAuthor.books.filter(
                (book) => book !== req.params.isbn
            );
            eachAuthor.books = newBookList;
            return;

        }
    });


    return res.json({
    book: database.books,
    author: database.author,
    message: "Author was deleted!!!"
    });
});

booky.listen(4000,() => {
    console.log("Server is up and running");
})
