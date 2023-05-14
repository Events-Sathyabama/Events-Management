'use client';
import Header from '../header';
import Poster from '../poster';
import Tabs from '../tabs';
import {useState} from 'react';
import useEffect from '../../useEffect';
import API from '../../API';
import Popup from '../../popup';
import EventTime from '../venue';
import Fab from '@mui/material/Fab';
import Link from 'next/link';
import LoadingButton from '@mui/lab/LoadingButton';
import ProgressBar from '../progressBar';
import {InterfaceData, InterfaceOrganizer} from '@/app/datainterface';
import ApiLoader from '../../apiLoader';
import handleError from '@/app/handleError';
import Description from '../description';
import Coordinators from '../coordinators';

const axios = new API.Axios();

const isUserFound = (
	user: InterfaceOrganizer,
	participant: InterfaceOrganizer[]
) => {
	console.log('isUserFound', user, participant);
	for (let i = 0; i < participant.length; i++) {
		if (participant[i].pk === user.pk) {
			console.log('True');
			return true;
		}
	}
	return false;
};

export default function details(props: {params: {id: number}}) {
	const [Spopup, setSpopup] = useState(false);
	const [Fpopup, setFpopup] = useState(false);
	const [popupMessage, setPopupMessage] = useState('');
	const [appliedCount, setAppliedCount] = useState(0);
	const [totalStrenth, setTotalStrenth] = useState(0);
	const [isApplied, setIsApplied] = useState(false);
	const [isAccepted, setIsAccepted] = useState(false);
	const [isDeclined, setIsDeclined] = useState(false);
	const [isOrganizer, setIsOrganizer] = useState(false);
	const [calledByApply, setCalledByApply] = useState(false);

	const [applying, setApplying] = useState(false);

	const [data, setData] = useState<InterfaceData>();
	const [Loader, setLoader] = useState(0);
	const runOnce = true; // makes this useEffect only run once
	useEffect(
		async () => {
			const request = await axios.get(
				API.get_url('event:detail', [props.params.id])
			);
			const data = request.data;
			if (request.status !== 200) {
				setLoader(request.status);
				return;
			}
			if (!data.hasOwnProperty('is_applied')) {
				setIsOrganizer(true);
			} else {
				setIsAccepted(data.is_accepted);
				setIsApplied(data.is_applied);
				setIsDeclined(data.is_declined);
			}

			setAppliedCount(data.applied_count);
			setTotalStrenth(data.total_strength);

			setData(data);
		},
		[],
		setLoader,
		runOnce
	);

	async function applyToEvent() {
		setApplying(true);
		setCalledByApply(true);
		try {
			const response = await axios.get(API.get_url('event:apply', props.params.id));
			console.log(response);
			setPopupMessage(response.data.message);
			setSpopup(true);
			if (data?.fcfs) {
				setAppliedCount((prev) => prev + 1);
				setIsAccepted(true);
			}
			setIsApplied(true);
		} catch (err: any) {
			console.log(err);
			if (err.response) {
				if (err.response.data.message !== undefined) {
					setPopupMessage(err.response.data.message);
				} else {
					setPopupMessage('Something went wrong!');
				}
			} else {
				setPopupMessage(err.message);
			}
			setFpopup(true);
			handleError(err, setLoader);
		}
		setApplying(false);
	}
	const progress = (data?.accepted_count || 0 / totalStrenth) * 100;

	return (
		<>
			{/* {<ApiLoader state={0} message="Fetching Data..." />} */}
			<div className="flex flex-col w-full h-auto items-center justify-center">
				{/* <div className="flex flex-row justify-between bg-gray-50 items-center fixed bottom-0 z-50 w-full h-16 -translate-x-1/2 border border-blue-300 left-1/2">
					<div className="flex flex-row items-center gap-3 ml-5">
						<p className="text-2xl text-black font-semibold">
							{totalStrenth === 0
								? "Total capacity isn't set!"
								: `${Math.round(progress)}%`}
						</p>
					</div>
					{!isOrganizer ? (
						<>
							{isApplied ? (
								<p
									className={
										'w-full border p-2 rounded-md text-center shadow-lg text-white bg-green-600 transition-all duration-1000' +
										(isDeclined
											? ' border-red-500 bg-red-600'
											: ' border-green-500 bg-green-600')
									}>
									{(() => {
										if (isDeclined) return 'Declined';
										if (isAccepted) return 'Accepted';
										if (isApplied) return 'Applied';
									})()}
								</p>
							) : (
								<LoadingButton
									loadingIndicator="Applying…"
									variant="contained"
									className="w-48 mr-5"
									onClick={applyToEvent}
									loading={applying}
									size="large"
									style={!applying ? {backgroundColor: '#1565c0'} : {}}>
									<span>Apply for Event</span>
								</LoadingButton>
							)}
						</>
					) : (
						<></>
					)}
				</div> */}
				<div className="flex flex-col w-full items-end">
					{Spopup ? (
						<Popup.Success
							showpopup={setSpopup}
							message={
								calledByApply ? popupMessage : 'Applications updated!'
							}></Popup.Success>
					) : null}
					{Fpopup ? (
						<Popup.Error
							showpopup={setFpopup}
							message={
								calledByApply ? popupMessage : 'Applications not updated!'
							}></Popup.Error>
					) : null}
				</div>
				<div className="flex flex-col w-11/12 h-auto">
					<Header
						club={data?.club?.name}
						short_desc={data?.short_description}
						title={data?.title}
					/>
					<div className="flex flex-col md:flex-row w-full h-auto mt-2 items-center gap-3 md:items-start justify-center">
						<div className="flex flex-col gap-5 w-72 sm:w-96 justify-center items-center">
							<Poster image={data?.image} />
							{totalStrenth === 0 ? (
								<div className='flex justify-center items-center rounded-md bg-gray-100 h-12 border border-gray-300 w-full'>Total capacity isn't set!</div>
							) : (
								<ProgressBar
									registeredStudents={data?.accepted_count || 0}
									totalCapacity={totalStrenth || 1}></ProgressBar>
							)}
						</div>
						<div className="flex flex-col w-full justify-center items-center mt-2 gap-3">
							<EventTime
								dates={data?.date}
								venue={data?.venue}
								time={data?.time}></EventTime>
							<Description long_desc={data?.long_description}></Description>
							<Coordinators
								coordinators={(() => {
									const rv = [];
									if (data !== undefined) {
										if (data.organizer.length > 0) rv.push(...data.organizer);
										if (data.owner) rv.push(data.owner);
									}
									return rv;
								})()}></Coordinators>
							{/* <Tabs
								coordinator={(() => {
									const rv = [];
									if (data !== undefined) {
										if (data.organizer.length > 0) rv.push(...data.organizer);
										if (data.owner) rv.push(data.owner);
									}
									return rv;
								})()}
								showSuccessPopup={() => setSpopup(true)}
								showFailurePopup={() => setFpopup(true)}
								isOrganizer={isOrganizer}
								participant={data?.participant || []}
								fcfs={data?.fcfs || false}
								eventId={props.params.id}
							/> */}
						</div>
						{isOrganizer ? (
							<Link href={`/event/update/${props.params.id}`}>
								<Fab
									color="primary"
									aria-label="edit"
									sx={{
										position: 'fixed',
										right: '1.5rem',
										bottom: '1.5rem',
										height: '4rem',
										width: '4rem',
									}}
									style={{backgroundColor: '#1565c0', zIndex: 10}}>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={1.5}
										stroke="currentColor"
										className="w-6 h-6">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
										/>
									</svg>
								</Fab>
							</Link>
						) : (
							<></>
						)}
					</div>
				</div>
			</div>
		</>
	);
}
