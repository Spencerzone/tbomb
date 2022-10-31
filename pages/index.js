import Head from 'next/head';
import Image from 'next/image';
import styles from './index.module.css';
import { casualList } from '../data/casuals';
import ColorBox from '../components/ColorBox';
import { useEffect, useState } from 'react';

// firestore
import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    updateDoc,
    getDoc,
    setDoc,
} from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

export default function Home() {
    const [listOfCasuals, setListOfCasuals] = useState([]);
    const [casual, setCasual] = useState({});
    const [load, setLoad] = useState();
    const [showAdd, setShowAdd] = useState(false);
    const [modalActive, setModalActive] = useState(false);
    const [userInfo, setUserInfo] = useState({});

    useEffect(() => {
        let list = [];

        const loadData = async () => {
            const querySnapshot = await getDocs(collection(db, 'casuals'));
            // console.log(querySnapshot.docs);
            querySnapshot.forEach((doc) => {
                // console.log(doc.data());
                // console.log(doc.id);
                const casualTeacher = doc.data();
                casualTeacher.id = doc.id;
                list.push(casualTeacher);
            });

            const sortedList = list.sort((a, b) => {
                if (a.lname > b.lname) return 1;
                if (a.lname < b.lname) return -1;
                return 0;
            });

            setListOfCasuals([...sortedList]);
        };

        loadData();
    }, [load]);

    const sortByDate = (date) => {
        const sortedList = listOfCasuals
            .filter((person) => {
                return person.active;
            })
            .sort((a, b) => {
                if (a.availability[date] > b.availability[date]) return -1;
                if (a.availability[date] < b.availability[date]) return 1;
                return 0;
            });
        setListOfCasuals([...sortedList]);
    };

    const sortByKla = () => {
        const sortedList = listOfCasuals.sort((a, b) => {
            if (a.kla > b.kla) return 1;
            if (a.kla < b.kla) return -1;
            return 0;
        });
        setListOfCasuals([...sortedList]);
    };

    const sortByLName = () => {
        const sortedList = listOfCasuals.sort((a, b) => {
            if (a.lname > b.lname) return 1;
            if (a.lname < b.lname) return -1;
            return 0;
        });
        setListOfCasuals([...sortedList]);
    };

    const sortByFName = () => {
        const sortedList = listOfCasuals.sort((a, b) => {
            if (a.fname > b.fname) return 1;
            if (a.fname < b.fname) return -1;
            return 0;
        });
        setListOfCasuals([...sortedList]);
    };

    const sortByActive = () => {
        const sortedList = listOfCasuals.sort((a, b) => {
            if (a.active > b.active) return -1;
            if (a.active < b.active) return 1;
            return 0;
        });
        setListOfCasuals([...sortedList]);
    };

    const addUser = async (user) => {
        console.log('CASUAL', casual);
        try {
            const docRef = await addDoc(collection(db, 'casuals'), {
                fname: user.fname,
                lname: user.lname || null,
                kla: user.kla || null,
                availability: {
                    monday: user.availability.monday || false,
                    tuesday: user.availability.tuesday || false,
                    wednesday: user.availability.wednesday || false,
                    thursday: user.availability.thursday || false,
                    friday: user.availability.friday || false,
                },
                active: user.active || null,
                notes: user.notes || null,
            });
            console.log('Document written with ID: ', docRef.id);
        } catch (e) {
            console.error('Error adding document: ', e);
        }
        setLoad((prev) => !prev);
    };

    console.log(listOfCasuals);

    const deleteCasual = async (e, id) => {
        e.preventDefault();
        console.log(id);
        const delCas = confirm('Are you sure you wish to delete this user?');
        if (delCas) {
            await deleteDoc(doc(db, 'casuals', id));
            setLoad((prev) => !prev);
        }
    };

    const toggleActive = async (e) => {
        console.log(e);
        const id = e.target.dataset.id;
        const toggle = confirm('Are you sure you wish to toggle activity for this casual?');
        if (toggle) {
            const docRef = doc(db, 'casuals', id);
            const active = await (await getDoc(docRef)).data().active;
            await updateDoc(docRef, { active: !active });
            setLoad((prev) => !prev);
        }
    };

    const toggleAvailability = async (e, day, fname) => {
        console.log(e, fname);
        // console.log(day);
        const id = e;
        const toggle = confirm(
            `Are you sure you wish to toggle availability for ${fname.toUpperCase()} on ${day.toUpperCase()}?`
        );
        if (toggle) {
            const docRef = doc(db, 'casuals', id);
            const docData = (await getDoc(docRef)).data();
            const available = (await getDoc(docRef)).data().availability[day];
            await setDoc(docRef, {
                ...docData,
                availability: { ...docData.availability, [day]: !available },
            });
            setLoad((prev) => !prev);
        }
    };

    const updateKLA = async (e) => {
        const id = e;
        const docRef = doc(db, 'casuals', id);
        const kla = (await getDoc(docRef)).data().kla;
        const newKLA = prompt('Please enter the updated KLA(s):', kla);
        console.log(newKLA);
        console.log(e);
        if (newKLA != null) {
            await updateDoc(docRef, { kla: newKLA });
            setLoad((prev) => !prev);
        }
    };
    const updateFName = async (e) => {
        const id = e;
        const docRef = doc(db, 'casuals', id);
        const name = (await getDoc(docRef)).data().fname;
        const newName = prompt('Please enter the updated name:', name);
        if (newName != null) {
            await updateDoc(docRef, { fname: newName });
            setLoad((prev) => !prev);
        }
    };
    const updateLName = async (e) => {
        const id = e;
        const docRef = doc(db, 'casuals', id);
        const name = (await getDoc(docRef)).data().lname;
        const newName = prompt('Please enter the updated name:', name);
        console.log(newName);
        console.log(e);
        if (newName != null) {
            await updateDoc(docRef, { lname: newName });
            setLoad((prev) => !prev);
        }
    };

    const updateNotes = async (e) => {
        const id = e.target.dataset.id;
        const docRef = doc(db, 'casuals', id);
        const note = (await getDoc(docRef)).data().notes;
        const newNote = prompt('Please enter the updated note:', note);
        if (newNote != null) {
            await updateDoc(docRef, { notes: newNote });
            setLoad((prev) => !prev);
        }
    };

    const showAddCasual = () => {
        setShowAdd((prev) => !prev);
    };

    const toggleModal = () => {
        setModalActive((prev) => !prev);
    };

    const activateDay = (day) => {
        console.log(userInfo);

        const isDayActive = userInfo.availability[day];
        console.log(isDayActive);
        setUserInfo((prev) => {
            return { ...prev, availability: { ...prev.availability, [day]: !isDayActive } };
        });
    };

    const editUser = async (e) => {
        const id = e;
        const docRef = doc(db, 'casuals', id);
        const userInformation = (await getDoc(docRef)).data();
        console.log(userInformation);
        setUserInfo({
            id,
            fname: userInformation.fname,
            lname: userInformation.lname,
            kla: userInformation.kla,
            active: userInformation.active,
            availability: {
                monday: userInformation.availability.monday,
                tuesday: userInformation.availability.tuesday,
                wednesday: userInformation.availability.wednesday,
                thursday: userInformation.availability.thursday,
                friday: userInformation.availability.friday,
            },
            notes: userInformation.notes,
        });
        toggleModal();
    };

    const submitEditUser = async (e) => {
        e.preventDefault();
        const docRef = doc(db, 'casuals', userInfo.id);
        console.log(docRef);
        await updateDoc(docRef, { active: userInfo.active });
    };

    return (
        <div className={styles.container}>
            <Head>
                <title>Casuals List</title>
                <meta name='description' content='Generated by RB' />
                <link rel='icon' href='/favicon.ico' />
            </Head>

            <main className={styles.main}>
                {showAdd ? (
                    <button onClick={showAddCasual}>Hide</button>
                ) : (
                    <button onClick={showAddCasual}>Add</button>
                )}

                <button onClick={toggleModal}>{modalActive ? 'Hide' : 'Show'} Modal</button>

                {showAdd ? (
                    <form
                        className={styles.form}
                        onSubmit={(e) => {
                            e.preventDefault();
                            addUser(casual);
                        }}
                    >
                        <label htmlFor=''>
                            <span>First Name: </span>
                            <input
                                type='text'
                                onChange={(e) => {
                                    setCasual((prev) => {
                                        return { ...prev, fname: e.target.value };
                                    });
                                }}
                            />
                        </label>
                        <label htmlFor=''>
                            <span>Last Name: </span>
                            <input
                                type='text'
                                onChange={(e) => {
                                    setCasual((prev) => {
                                        return { ...prev, lname: e.target.value };
                                    });
                                }}
                            />
                        </label>
                        <label htmlFor=''>
                            <span>KLAs: </span>
                            <input
                                type='text'
                                onChange={(e) => {
                                    setCasual((prev) => {
                                        return { ...prev, kla: e.target.value };
                                    });
                                }}
                            />
                        </label>
                        <label htmlFor=''>
                            <span>Notes: </span>
                            <input
                                type='text'
                                onChange={(e) => {
                                    setCasual((prev) => {
                                        return { ...prev, notes: e.target.value };
                                    });
                                }}
                            />
                        </label>
                        <label htmlFor=''>
                            <span>Active: </span>
                            <input
                                type='checkbox'
                                name=''
                                id=''
                                onClick={(e) => {
                                    setCasual((prev) => ({ ...prev, active: e.target.checked }));
                                }}
                            />
                        </label>
                        <label htmlFor=''>
                            <span>Mon:</span>
                            <input
                                type='checkbox'
                                name=''
                                id=''
                                onClick={(e) => {
                                    setCasual((prev) => ({
                                        ...prev,
                                        availability: {
                                            ...prev.availability,
                                            monday: e.target.checked,
                                        },
                                    }));
                                }}
                            />
                        </label>
                        <label htmlFor=''>
                            <span>Tues: </span>
                            <input
                                type='checkbox'
                                name=''
                                id=''
                                onClick={(e) => {
                                    setCasual((prev) => ({
                                        ...prev,
                                        availability: {
                                            ...prev.availability,
                                            tuesday: e.target.checked,
                                        },
                                    }));
                                }}
                            />
                        </label>
                        <label htmlFor=''>
                            <span>Wed: </span>
                            <input
                                type='checkbox'
                                name=''
                                id=''
                                onClick={(e) => {
                                    setCasual((prev) => ({
                                        ...prev,
                                        availability: {
                                            ...prev.availability,
                                            wednesday: e.target.checked,
                                        },
                                    }));
                                }}
                            />
                        </label>
                        <label htmlFor=''>
                            <span>Thurs: </span>
                            <input
                                type='checkbox'
                                name=''
                                id=''
                                onClick={(e) => {
                                    setCasual((prev) => ({
                                        ...prev,
                                        availability: {
                                            ...prev.availability,
                                            thursday: e.target.checked,
                                        },
                                    }));
                                }}
                            />
                        </label>
                        <label htmlFor=''>
                            <span>Fri: </span>
                            <input
                                type='checkbox'
                                name=''
                                id=''
                                onClick={(e) => {
                                    setCasual((prev) => ({
                                        ...prev,
                                        availability: {
                                            ...prev.availability,
                                            friday: e.target.checked,
                                        },
                                    }));
                                }}
                            />
                        </label>
                        <button type='submit'>Add Casual</button>
                    </form>
                ) : undefined}

                <h2>List of Casuals</h2>

                {modalActive ? (
                    <dialog open className={styles.modal}>
                        <form>
                            <label>
                                <span>FName: </span>
                                <input type='text' defaultValue={userInfo.fname} />
                            </label>
                            <label>
                                <span>LName: </span>
                                <input type='text' defaultValue={userInfo.lname} />
                            </label>
                            <label>
                                <span>KLA: </span>
                                <input type='text' defaultValue={userInfo.kla} />
                            </label>
                            <label>
                                <span>Active:</span>
                                <input
                                    type='checkbox'
                                    name=''
                                    id=''
                                    defaultChecked={userInfo.active}
                                    onChange={(e) => {
                                        setUserInfo((prev) => {
                                            return { ...prev, active: e.target.checked };
                                        });
                                    }}
                                />
                            </label>

                            <label>
                                <span>Notes</span>
                                <textarea
                                    name=''
                                    id=''
                                    cols='30'
                                    rows='10'
                                    defaultValue={userInfo.notes}
                                ></textarea>
                            </label>

                            <span>Availability</span>
                            <input
                                type='button'
                                value='Monday'
                                onClick={() => {
                                    activateDay('monday');
                                }}
                                className={
                                    userInfo.availability.monday
                                        ? styles.activeDay
                                        : styles.inactiveDay
                                }
                            />
                            <input
                                type='button'
                                value='Tuesday'
                                onClick={() => {
                                    activateDay('tuesday');
                                }}
                                className={
                                    userInfo.availability.tuesday
                                        ? styles.activeDay
                                        : styles.inactiveDay
                                }
                            />
                            <input
                                type='button'
                                value='Wednesday'
                                onClick={() => {
                                    activateDay('wednesday');
                                }}
                                className={
                                    userInfo.availability.wednesday
                                        ? styles.activeDay
                                        : styles.inactiveDay
                                }
                            />
                            <input
                                type='button'
                                value='Thursday'
                                onClick={() => {
                                    activateDay('thursday');
                                }}
                                className={
                                    userInfo.availability.thursday
                                        ? styles.activeDay
                                        : styles.inactiveDay
                                }
                            />
                            <input
                                type='button'
                                value='Friday'
                                onClick={() => {
                                    activateDay('friday');
                                }}
                                className={
                                    userInfo.availability.friday
                                        ? styles.activeDay
                                        : styles.inactiveDay
                                }
                            />

                            <button
                                onClick={(e) => {
                                    deleteCasual(e, userInfo.id);
                                }}
                            >
                                Delete User
                            </button>
                            <button type='submit' onClick={submitEditUser}>
                                Submit
                            </button>
                        </form>
                    </dialog>
                ) : null}

                <div className={styles.casuals}>
                    <div className={styles.headings}>
                        <div className={styles.sortHeader}>Edit</div>
                        <div className={styles.sortHeader} onClick={sortByFName}>
                            Name
                        </div>
                        <div className={styles.sortHeader} onClick={sortByLName}>
                            Surname
                        </div>
                        <div className={styles.sortHeader} onClick={sortByKla}>
                            KLA
                        </div>
                        <div className={styles.sortHeader} onClick={sortByActive}>
                            Active
                        </div>
                        {/* <div>Delete</div> */}
                        <div>Notes</div>
                    </div>
                    <div className={styles.subgrid}>
                        <div className={styles.sortHeader} onClick={() => sortByDate('monday')}>
                            Mon
                        </div>
                        <div className={styles.sortHeader} onClick={() => sortByDate('tuesday')}>
                            Tues
                        </div>
                        <div className={styles.sortHeader} onClick={() => sortByDate('wednesday')}>
                            Wed
                        </div>
                        <div className={styles.sortHeader} onClick={() => sortByDate('thursday')}>
                            Thurs
                        </div>
                        <div className={styles.sortHeader} onClick={() => sortByDate('friday')}>
                            Fri
                        </div>
                    </div>
                </div>

                {listOfCasuals.map((teacher, i) => {
                    return (
                        <div key={i} className={styles.casuals}>
                            <div className={styles.headings}>
                                {/* <div onClick={() => updateFName(teacher.id)}>{teacher.fname}</div> */}
                                <div onClick={() => editUser(teacher.id)}>[edit]</div>
                                <div>{teacher.fname}</div>
                                <div>{teacher.lname}</div>
                                <div>{teacher.kla}</div>
                                <div className={styles.active} data-id={teacher.id}>
                                    {teacher.active ? 'Yes' : 'No'}
                                </div>
                                {/* <div>
                                    <button onClick={deleteCasual} data-id={teacher.id}>
                                        X
                                    </button>
                                </div> */}
                                <div className={styles.notes} data-id={teacher.id}>
                                    {teacher.notes ? teacher.notes : '---'}
                                </div>
                            </div>
                            <div className={styles.subgrid}>
                                <div>
                                    {teacher.availability.monday ? (
                                        <ColorBox available={true} />
                                    ) : (
                                        <ColorBox available={false} />
                                    )}
                                </div>
                                <div>
                                    {teacher.availability.tuesday ? (
                                        <ColorBox available />
                                    ) : (
                                        <ColorBox available={false} />
                                    )}
                                </div>
                                <div>
                                    {teacher.availability.wednesday ? (
                                        <ColorBox available />
                                    ) : (
                                        <ColorBox available={false} />
                                    )}
                                </div>
                                <div>
                                    {teacher.availability.thursday ? (
                                        <ColorBox available />
                                    ) : (
                                        <ColorBox available={false} />
                                    )}
                                </div>
                                <div>
                                    {teacher.availability.friday ? (
                                        <ColorBox available />
                                    ) : (
                                        <ColorBox available={false} />
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </main>
        </div>
    );
}
