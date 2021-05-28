const express = require('express');
const app = require('../app');
const router = express.Router();
const { isLoggedIn } = require('../lib/auth')
const db = require('../database')

router.get('/create' , isLoggedIn, (req, res) => {
    res.render('reports/create');
})
router.post('/create', isLoggedIn, async(req,res) => {
    try{
        const {Name, Reporter, Reason} = req.body;
        const date = app.getDate();
        const Status = "open";
        await app.getIp(Name).then(Ip => {
            const info = {
                Name,
                Reporter,
                Reason,
                date,
                Status
            };
            db.query(`INSERT INTO sc_reports SET ? ` ,[info]);
            req.flash('success', 'Report Created Correctly')
            res.redirect('/reports');
        });
    } catch (e) {
        req.flash('error', 'Could not create the Report')
        res.redirect('/reports/create');
    }
})
router.get('/', isLoggedIn, async (res,req)=>{
    const reports = await db.query('SELECT * FROM `sc_reports` ORDER BY `ReportId`');
    if (reports.length <= 0) {
        req.render('reports/reports',{reports}, req.flash('error','No reports found'));
    }
    req.render('reports/reports',{reports});
})


router.get('/delete/:id', isLoggedIn, async (req,res) =>{
    const id = req.params.id;
    await db.query('DELETE FROM sc_reports WHERE ReportId = ?', [id]);
    req.flash('success', 'Report Deleted Correctly')
    res.redirect('/reports')
});

router.get('/edit/:id', isLoggedIn, async (req,res) =>{
    const id = req.params.id;
    const reports = await db.query('SELECT * FROM `sc_reports` WHERE ReportId = ?', [id]);
    res.render('reports/edit', {reports: reports[0]})
});

router.post('/edit/:id', isLoggedIn, async (req,res)=>{
    const id = req.params.id;
    const {Name, Reporter, Reason} = req.body;
    const info = {
        Name,
        Reporter,
        Reason
    };
    try{
        await db.query(`UPDATE sc_reports SET ? WHERE ReportId = ?`,[info,id]);
        req.flash('success', 'Report Edited Correctly')
        res.redirect('/reports');
    } catch (e) {
        req.flash('error', `Couldn't edit the report`);
        res.redirect('/reports/edit'+id);
    }


})


router.get('/new' , isLoggedIn,(req, res) => {
    res.render('reports/reports');
})

module.exports = router;