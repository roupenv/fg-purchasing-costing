import { prisma } from '../prismaClient';
import {InvoicePrismaServices} from '../invoiceServices'
import dashboardRouter from '../../api/routes/dashboardRoutes';

const testService = new InvoicePrismaServices();

// afterAll(async () => {
//   await prisma.$disconnect();  
// });

// describe('Invoice Prisma Tests', () => {
//   it('Gets Next Invoice', async () => {
//     testService.id = 13;
//     expect(await testService.getNextRecord()).toEqual({ id: 36 });
//   }),
//     it('Gets Previous Invoice', async () => {
//       testService.id = 36;
//       expect(await testService.getPreviousRecord()).toEqual({ id: 13 });
//     }),
//     it('Gets First Invoice', async () => {
//       expect(await testService.getFirstRecord()).toEqual({ id: 72 });
//     }),
//     it('Gets Last Invoice', async () => {
//       expect(await testService.getLastRecord()).toEqual({ id: 2 });
//     }),
    
//     it('Gets Invoice', async () => {
//       testService.id = 2;
//       expect(await testService.getInvoice()).toEqual(
//         expect.objectContaining({
//           data: expect.any(Object),
//           header: expect.any(Object),
//         })
//       );
//     });
//     it('Gets All Invoices', async () => {
//       const sampleInvoice = {
//         data: expect.arrayContaining([
//           expect.objectContaining({
//             id: expect.any(Number)
//           })
//         ])
//       } 
//       testService.id = 2;
//       expect(await testService.getAllInvoices()).toEqual(
//         expect.objectContaining(sampleInvoice)
//       );
//     });
  
//     it('Updates Line Item and Check if Successfully Updated', async () => {
//       const payload = {
//         updatedList: [
//           {
//             id: 1218,
//             po_ref: null,
//             product: "SHOWGIRL",
//             color: "NAVY",
//             quantity: 7,
//             price: "28.7",
//             discount: "0",
//             line_total: "200.9",
//             sample: false
//           }
//         ],
//         formData: {
//           id: 72,
//           invoice_number: "1/70 2022",
//           date: "2021-07-26T00:00:00.000Z",
//           vendor: "ALISPED"
//         }
//       }      
//       testService.id = 72;
//       testService.payload = payload     
//       expect(await testService.updateInvoice()).toEqual(
//         expect.objectContaining({
//           date: expect.any(Date),
//           id: expect.any(Number),
//           invoice_number: expect.any(String),
//           vendor_fk: expect.any(Number)
//         })
//       );
//       expect(await testService.getInvoice()).toHaveProperty('header.invoice_number', "1/70 2022")
//       expect(await testService.getInvoice()).toHaveProperty('header.vendor', "ALISPED")
//     });


//     it('Adds Line Item and Checks If Added', async () => {
//       const payload = [
//         {
//           id: 1563,
//           po_ref: "",
//           product: "ALFIE",
//           color: "TEST",
//           quantity: "25",
//           price: "123.00",
//           discount: "1.23",
//           line_total: "3044.25",
//           sample: "TRUE"
//         }
//       ]
//       testService.id = 72;
//       testService.payload = payload
//       expect(await testService.addLineItems())
//       const updatedInvoice = await testService.getInvoice()
//       const lastItem = updatedInvoice.data[updatedInvoice.data.length -1]
//       expect(lastItem['product']).toEqual('ALFIE')
//       expect(lastItem['color']).toEqual( "TEST")
//       expect(lastItem['quantity']).toEqual(25)
//       // expect(lastItem['price']).toBe('123')
//       // expect(lastItem['discount']).toEqual("1.23")
//       // expect(lastItem['line_total']).toEqual( "3044.25")
//       expect(lastItem['sample']).toEqual("TRUE")
//     });
    
    
  
});
