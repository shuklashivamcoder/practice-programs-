
import { Country } from "../models/country.models.js";
import { State } from "../models/state.models.js"
import { City } from "../models/city.models.js"
import { Course } from "../models/course.models.js"
import { Student } from "../models/student.models.js";
import csv from 'csvtojson'

export async function handlestudentdata(req, res) {
    try {
        const filepath = req.file.path;
        console.log(filepath)
        const students = await csv().fromFile(filepath)

        for (const student of students) {
            const { name, email, phone, country, state, city, course } = student;
          
            const countrydata = await  Country.create({ countryname: country?.toLowerCase() });


            const citydata = await City.create({cityname: city.toLowerCase });




            const statedata = await State.create({statename: state.toLowerCase });

            let courseArr = [];
            if (Array.isArray(course)) {
                courseArr = course;
            } else if (typeof course === "string" && course.trim() !== "") {
                courseArr = course.split(",").map(c => c.trim());
            }


            let courseIds = [];
            if (courseArr.length > 0) {
                courseIds = await Promise.all(
                    courseArr.map(async (coursename) => {
                        let coursedata = await Course.findOne({ name: coursename.toLowerCase() })
                        if (!coursedata) {
                            coursedata = await Course.create({ name: coursename.toLowerCase() })
                        }
                        return coursedata?._id
                    })
                )
            }

//             const existStudent = await Student.findOne({ phone })
//             if (existStudent) {
//             const mergedCourses = Array.from(new Set([...(existStudent.course || []), ...courseIds]));

//             await Student.findByIdAndUpdate(existStudent._id,{
                    
//                     name : name?.toLowerCase(),
//                     email: email?.toLowerCase(),
//                     country : countrydata._id,
//                     state : statedata._id,
//                     city : citydata._id,
//                     course : mergedCourses
                
//             },
// {
//   new : true
// }

//         )

//             }
   
// remove duplicates of country



            
                await Student.findOneAndUpdate({ phone }, {
                name: name.toLowerCase(),
                email: email.toLowerCase(),
                country: countrydata._id,
                state: statedata._id,
                city: city._id,
                course: courseIds
            }, {
                upsert: true, new: true, setDefaultsOnInsert: true
            })
            
            
        }

        return res.json({
            message: "user saved successfully",
        })

    } catch (error) {
        console.log(error)
        return res.json({
            error: error

        })
    }



}

