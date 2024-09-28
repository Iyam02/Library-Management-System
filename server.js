const mysql = require('mysql2');
const dotenv = require('dotenv');
const cors =require('cors');
const bcrypt = require('bcryptjs');
const express = require('express');
const session = require('express-session')
const path = require('path');
const { check, validationResult } = require('express-validator');
const bodyParser = require('body-parser');

//application
const app = express();

//load environment vaiables
dotenv.config();

//middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'secretKey123#',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }  
}));

//serve static files
app.use(express.static(path.join(__dirname, '/')));

//connect to MySQL server
const db = mysql.createConnection(
    {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DATABSE
    }
);

//confirm connection
db.connect((err) => {
    if(err) throw new err

    console.log('Connected successfully')
});

//serve HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
});

app.get('/api/login', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
});

app.get('/api/register', (req, res) =>{
    res.sendFile(path.join(__dirname,'/public/register.html'))
});

app.get('/api/user-dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/user_dashboard.html'))
});

app.get('/api/staff/dashboard', (req, res)=> {
    res.sendFile(path.join(__dirname, '/public/admin.html'))
});

app.get('/staff/login', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/staff_login.html'))
})

//Register a user
app.post('/api/user/register', [
    check('name').notEmpty().withMessage('Name is required').isLength({ min: 3 }).withMessage('Name must be at least 3 characters'),
    check('email').isEmail().withMessage('Invalid email'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long').isStrongPassword({
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    }).withMessage('Password must contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 special character'),
    check('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords do not match');
        }
        return true;
    })
], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }

    console.log(errors.array());

    const { name, email, password, mobile } = req.body;

    console.log(req.body);

    try {
        // Check if user already exists
        const checkUserQuery = 'SELECT * FROM Members WHERE email = ?';
        db.query(checkUserQuery, [email], async (err, results) => {
            if (err) {
                console.error('Database error: ', err);
                return res.status(500).json({
                    success: false,
                    message: 'Database error'
                });
            };

            if (results.length > 0) {
                // User already exists
                return res.status(400).json({
                    success: false,
                    message: 'User already exists'
                });
            }

            // If user does not exist, hash the password
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // db query to register new user
            const registerUserQuery = 'INSERT INTO Members(name, email, password, mobile) VALUES(?, ?, ?, ?)';

            db.query(registerUserQuery, [name, email, hashedPassword, mobile], (err, results) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ success: false,
                    message: 'Database error' });
                }
                
                // Registration successful, redirect to dashboard
                res.status(201).json({ 
                    success: true, 
                    message: 'Successful Registration',
                    redirectUrl: '/public/index.html' });

            });
        });
    } catch (error) {
        console.error('Error: ', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

//login route
app.post('/api/user/login', [
    check('email').isEmail().withMessage('A valid email is required'),
    check('password').not().isEmpty().withMessage('Password is required')
] ,(req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            success: false,
            message: 'Validation error',
            errors: errors.array()
        });
    }
    const { email, password } = req.body;

    try {
        //check if user exists
        const getUserQuery = 'SELECT * FROM Members where email = ? ';

        db.query(getUserQuery, [email], async (err, results) => {
            if(err){
                console.error('Error occurred: , err');

                return res.status(500).json({ 
                    success: false,
                    message: 'Database error' });
            }

            if(results.length === 0){
                //user does not exist
                return res.status(400).json({ 
                        success: false,
                        message: 'Invalid email or password' });
            }

            const user = results[0];

            //compare passwords 
            const passwordMatch = await bcrypt.compare(password, user.password);

            //if password don't match
            if(!passwordMatch){
                return res.status(400).json({ 
                    success: false,
                    message: 'Invalid email or password' });
            }

            // Store user information in session
            req.session.userId = user.member_id;
            req.session.userName = user.name;
            req.session.userEmail = user.email;

            // Log session details to check if they are being set
            //console.log('Session after login:', req.session);

            //if password matches,
            //LOgin successful
            return res.status(200).json({
                success: true,
                message: 'Login successful'
            });
        });

    } catch(error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

//staff login
app.post('/api/staff/login', [
    check('email').isEmail().withMessage('A valid email is required'),
    check('password').not().isEmpty().withMessage('Password is required')
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            success: false,
            message: 'Validation error',
            errors: errors.array()
        });
    }

    const { email, password } = req.body;

    try{
        //check if user exists
        const getStaffQuery = 'SELECT * FROM Admins WHERE email = ? ';

        db.query(getStaffQuery, [email], (err, results) => {
            if(err) {
                console.error('Error occurred: ', err);

                return res.status(500).json({
		        success: false,
		        message: 'Database error' 
                });
            }

            if(results.length === 0){
                //if staff does not exist
                return res.status(400).json({ 
		        success: false,
		        message: 'Invalid email or password'
                });
            }

            //if staff exists
            const staff = results[0];
            
            // compare passwords
            //if password don't match
            if(password !== staff.password){
                return res.status(400).json({ 
		        success: false,
		        message: 'Invalid email or password.' 
                });
            }

            // Store admin information in session
            req.session.userId = staff.admin_id;
            req.session.userName = staff.name;
            req.session.userEmail = staff.email;  
            req.session.isAdmin = true;  
            
            //if password matches
            return res.status(200).json({
            	success: true,
            	message: 'Login successful',
                redirectUrl: '/public/admin.html'
            });
        });
    } catch(error){
        console.error(error);
        res.status(500).json({ 
            success: false,
            message: 'Server error' 
        });
    }
});

//Get the user's name
app.get('/api/getUser-name', async (req, res) => {
    const userName = req.session.userName;

    if(!userName){
        return res.status(401).json({
            success: true,
            message: 'User not logged in'
        });
    }

    return res.status(200).json({
        success: true,
        name: userName
    })
});

//Get admin's name
app.get('/api/getAdmin-name', async (req, res) => {
    const adminName = req.session.userName;

    if(!adminName || req.session.isAdmin){
        return  res.status(401).json({
            success: false,
            message: 'Unauthorized access'
        })
    }

    return res.status(200).json({
        success: true,
        name: adminName
    });
});

//Log Out route
app.post('/api/user/logout', (req, res)=>{
    req.session.destroy((err) =>{
        if(err){
            return res.status(500).json({
                success: false,
                message: 'Error logging out'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Logged out successful',
            redirectUrl: '/public/index.html'
        });
    });
});

//Display the books
app.get('/api/get-books', async (req, res)=>{
    const getBooksQuery = 'SELECT * FROM Books';
    db.query(getBooksQuery, (err, results) => {     
        if(err){
            return res.status(401).json({
                success: false,
                message: 'Error fetching books'
            })
        }

        if(results.length > 0){
            return res.status(200).json({
                success: true,
                data: results
            })
        } else {
            return res.status(404).json({
                success: false,
                message: 'No books found'
            })
        }
    })
});

//Display Members
app.get('/api/get-members', async(req, res)=> {
    const getMembersQuery = 'SELECT * FROM Members';
    db.query(getMembersQuery, (err, results )=>{
        if(err) {
            return res.status(401).json({
                success: falses,
                message: "No members found"
            })
        } 
        
        if(results.length > 0){
            return res.status(201).json({
                success: true,
                data: results
            })
        }else {
            return res.status(404).json({
                success: false,
                message: 'No members found'
            })
        }
    });
});

//Get the total number of books
app.get('/api/total-books', async(req, res) => {
    const totalBooksCountQuery = 'SELECT COUNT(name) AS totalBooks FROM Books';
    db.query(totalBooksCountQuery, (err, results) => {
        if(err) {
             console.log('Database error: ', err); 
            return res.status(500).json({
                success:false,
                message: 'Database error'
            });
        }

        const totalBooks = results[0].totalBooks

        return res.status(200).json({
            success: true,
            totalBooks: totalBooks
        });
    });
});

//Get the total number of members
app.get('/api/total-members', async(req, res) => {
    const totalMembersCountQuery = 'SELECT COUNT(name) AS totalMembers FROM Members';
    db.query(totalMembersCountQuery, (err, results) => {
        if(err) {
            return res.status(500).json({
                success:false,
                message: 'Database error'
            });
        }

        const totalMembers = results[0].totalMembers

        return res.status(200).json({
            success: true,
            totalMembers: totalMembers
        });
    });
});

//Display borrowed books
app.get('/api/get-borrowed-books', async(req, res) => {
    const memberId = req.session.userId;

    // Log session details to confirm the memberId
    //console.log(memberId)

    const getBorrowedBookQuery = `
        SELECT Books.title, Transactions.borrow_date, Transactions.return_date,
        CASE 
            WHEN Transactions.return_date > NOW() THEN 'On Time' 
            ELSE 'Due Soon' 
        END as status
        FROM Transactions
        INNER JOIN Books ON Transactions.book_id = Books.book_id
        WHERE Transactions.member_id = ?
        AND Transactions.return_status = 0;
    `;
    db.query(getBorrowedBookQuery, [memberId], (err, results) => {
        if(err){
            return res.status(500).json({
                success: false,
                message: 'Error retrieving the books'
            })
        } else {
            return res.status(200).json({
                success: true,
                data: results
            })
        }
    });
});

//Update contact details
app.put('/api/update-contact-details', async (req, res) => {
    const memberId = req.session.userId;
    const { name, email, mobile } = req.body;

    //validate the data
    if(!name || !email || !mobile){
        return res.status(401).json({
            success: false,
            message: 'Please Log in again'
        });
    }

    //update query fot the db
    const  updateDetailsQuery = `UPDATE Members SET name = ?, email = ?, mobile = ? WHERE member_id = ?`;

    db.query(updateDetailsQuery, [name, email, mobile], async (err, result) => {
        if(err){
            console.error('Error: ', err);
            return res.status(500).json({
                success: false,
                message: 'Failed to update contact details'
            });
        }

        //confirm the update
        if(result.affectedRows > 0) {
            return res.status(200).json({
                success: true,
                message: 'Contact details updated successfully'
            });
        } else {
            return res.status(400).json({
                success: false,
                message: 'Update failed. No changes were made'
            });
        }
    });
});

//Start the server
app.listen(4000, () => {
    console.log('Server is up and running...')
});
