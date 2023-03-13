export const random = (length: number): string => {
	let result = "";
	const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
};


export const TheDate = async (date?: { amount: number; unit: String }) => {
	if (date === undefined) {
		return new Date().toISOString().slice(0, 10);
	}
	let newDate = new Date();
	let multiplier=1;

	switch(date.unit.toLowerCase()){
		case 'm':
			multiplier*=28; // could do 365/12 then take the lowerday 
			break;
		case 'y':
			multiplier*=365;
			break;
		case'w':
			multiplier*=7;
			break;
	}

	// Add two weeks
	newDate.setDate(newDate.getDate() + date.amount * multiplier);

	return newDate.toISOString().slice(0, 10);



	

}