#!/usr/bin/env python

from passbook.models import Pass, Barcode, StoreCard



def main():

	cardInfo = StoreCard()
	cardInfo.addPrimaryField('name', 'John Doe', 'Name')

	organizationName = 'Your organization' 
	passTypeIdentifier = 'pass.com.your.organization' 
	teamIdentifier = 'AGK5BZEN3E'

	passfile = Pass(cardInfo, \
	    passTypeIdentifier=passTypeIdentifier, \
	    organizationName=organizationName, \
	    teamIdentifier=teamIdentifier)
	passfile.serialNumber = '1234567' 
	passfile.barcode = Barcode(message = 'Barcode message')    
	passfile.addFile('icon.png', open('passbook_images/cake_logo.png', 'r'))
	passfile.addFile('logo.png', open('passbook_images/cake_logo.png', 'r'))
	passfile.create('certificate.pem', 'key.pem', 'wwdr.pem', '123456', 'test.pkpass') # Create and output the Passbook file (.pkpass) 



if __name__ == "__main__":
    main()