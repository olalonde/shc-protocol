# Smart Health Cards library

Library for decoding and verifying [Smart Health Cards](https://smarthealth.cards) data (e.g. the Quebec Covid Vaccine QR code).

## Example

```js
import decode from "shc-protocol";

(async () => {
  const rawQrText =
    "shc:/567629095243206034602924374044603122295953265460346029254077280433602870286471674522280928613331456437653141590640220306450459085643550341424541364037063665417137241236380304375622046737407532323925433443326057360106452931531270742428395038692212766566046938775507593966070420405229673107363333693803425720586229543633123300103877712022113608123739554159750065216576244136280332243607756009665859260023605803272728675721123035212164252561302458076644543210260735435742003171574339537172115043532966334536735428113958605523117307120954595940355931687040114532417303424039651066632209425741412212703267325456534137225708120573042126716936576331122727086139744341560859437500341264706904260465583253732838100829123422126208775858655545243477645920507637325929080373682704763707057100412927585265582550667760036577704021621136444536642771754403736036776160662638060600324033352612760522074054305466502054376441420410096741425206682467446356124533125330537750124227303028400359750054286111584333366267631155530460382155690074592636502724332654657410557730225306356323745403423657422565211128283333346832702663720538744360722833654566035731067308726224373476706465293608106711742940525720295456606873533426066835102443280923746156754126314130556412726961056137220606047644413737522667302267377250590432617356226443096866703304680076745369120674030573312336127454012437565572373107004250255426335362717057650427082543112329402404675520202939260458387410313866226959567029050800693059723470237666045873346268737738504572586731601071064358";
  const result = await decode(rawQrText);
  console.log(result);
})();
```

Result:

```js
{
  header: {
    zip: 'DEF',
    alg: 'ES256',
    kid: '3Kfdg-XwP-7gXyywtUfUADwBumDOPKMQx-iELL11W9s'
  },
  payload: {
    iss: 'https://smarthealth.cards/examples/issuer',
    nbf: 1620847989.837,
    vc: {
      type: [
        'https://smarthealth.cards#health-card',
        'https://smarthealth.cards#immunization',
        'https://smarthealth.cards#covid19'
      ],
      credentialSubject: {
        fhirVersion: '4.0.1',
        fhirBundle: {
          resourceType: 'Bundle',
          type: 'collection',
          entry: [
            {
              fullUrl: 'resource:0',
              resource: {
                resourceType: 'Patient',
                name: [ { family: 'Anyperson', given: [ 'John', 'B.' ] } ],
                birthDate: '1951-01-20'
              }
            },
            {
              fullUrl: 'resource:1',
              resource: {
                resourceType: 'Immunization',
                status: 'completed',
                vaccineCode: {
                  coding: [
                    {
                      system: 'http://hl7.org/fhir/sid/cvx',
                      code: '207'
                    }
                  ]
                },
                patient: { reference: 'resource:0' },
                occurrenceDateTime: '2021-01-01',
                performer: [ { actor: { display: 'ABC General Hospital' } } ],
                lotNumber: '0000001'
              }
            },
            {
              fullUrl: 'resource:2',
              resource: {
                resourceType: 'Immunization',
                status: 'completed',
                vaccineCode: {
                  coding: [
                    {
                      system: 'http://hl7.org/fhir/sid/cvx',
                      code: '207'
                    }
                  ]
                },
                patient: { reference: 'resource:0' },
                occurrenceDateTime: '2021-01-29',
                performer: [ { actor: { display: 'ABC General Hospital' } } ],
                lotNumber: '0000007'
              }
            }
          ]
        }
      }
    }
  },
  verifications: {
    trustable: true,
    verifiedBy: '3Kfdg-XwP-7gXyywtUfUADwBumDOPKMQx-iELL11W9s',
    origin: 'https://smarthealth.cards/examples/issuer'
  }
}

```

## Credits and inspiration :

- https://github.com/obrassard/shc-extractor/
- https://github.com/dvci/health-cards-walkthrough/blob/main/SMART%20Health%20Cards.ipynb
- https://gist.github.com/remi/e3aa2f78845ee13f706ed83aead5145f
- Special thanks to @fproulx, who found the public key that allows validation of Qc Gov. QR Codes.

## References

- [FHIR](https://hl7.org/fhir/): FHIR is a standard for health care data exchange.
