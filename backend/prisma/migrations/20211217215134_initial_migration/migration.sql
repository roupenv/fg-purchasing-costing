-- CreateTable
CREATE TABLE "color" (
    "id" SERIAL NOT NULL,
    "color_code" VARCHAR(4) NOT NULL,
    "color_name" VARCHAR(64),
    "material" VARCHAR(64),

    CONSTRAINT "color_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "duty_line_items" (
    "id" SERIAL NOT NULL,
    "shipment_fk" INTEGER NOT NULL,
    "tarrif_fk" INTEGER NOT NULL,
    "units_entered" INTEGER,
    "value_entered" MONEY,
    "duty_percentage" REAL,
    "processing_fee_percentage" REAL,
    "line_total" MONEY,

    CONSTRAINT "duty_line_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice" (
    "id" SERIAL NOT NULL,
    "invoice_number" VARCHAR(24) NOT NULL,
    "date" TIMESTAMPTZ(6) NOT NULL,
    "vendor_fk" INTEGER,

    CONSTRAINT "invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice_line_items" (
    "id" SERIAL NOT NULL,
    "invoice_fk" INTEGER NOT NULL,
    "po_ref" VARCHAR(32),
    "product_fk" INTEGER NOT NULL,
    "color" VARCHAR(64),
    "quantity" INTEGER,
    "price" MONEY,
    "discount" MONEY,
    "line_total" MONEY,
    "sample" BOOLEAN,
    "line_total_discount" MONEY,

    CONSTRAINT "invoice_line_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment" (
    "id" SERIAL NOT NULL,
    "payment_vendor_fk" INTEGER,
    "reference_number" VARCHAR(64) NOT NULL,
    "date_booked" TIMESTAMPTZ(6) NOT NULL,
    "payment_exch_rate" REAL,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_invoice" (
    "payment_line_item_id" INTEGER,
    "invoice_id" INTEGER,
    "id" SERIAL NOT NULL,

    CONSTRAINT "payment_invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_line_item" (
    "id" SERIAL NOT NULL,
    "vendor_fk" INTEGER NOT NULL,
    "usd_cost" MONEY,
    "euro_payment" MONEY,
    "tracking_number" VARCHAR(64),
    "description" VARCHAR,
    "payment_fk" INTEGER NOT NULL,

    CONSTRAINT "payment_line_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product" (
    "id" SERIAL NOT NULL,
    "product_name" VARCHAR(64) NOT NULL,
    "bottom" VARCHAR(24),
    "tarrif_fk" INTEGER,
    "season" VARCHAR(4),
    "collection" VARCHAR(12),

    CONSTRAINT "product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_color" (
    "products_id" INTEGER,
    "colors_id" INTEGER,
    "id" SERIAL NOT NULL,

    CONSTRAINT "product_color_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shipment" (
    "id" SERIAL NOT NULL,
    "shipment_ref" VARCHAR(24) NOT NULL,
    "shipping_vendor_fk" INTEGER,
    "departure_date" TIMESTAMPTZ(6),
    "arrival_date" TIMESTAMPTZ(6),
    "trans_method" VARCHAR(12),
    "weight" INTEGER,
    "weight_unit" VARCHAR(4),
    "volume" REAL,
    "volume_unit" VARCHAR(8),
    "chargeable_weight" INTEGER,
    "chargeable_weight_unit" VARCHAR(4),
    "packs" INTEGER,
    "packs_type" VARCHAR(8),
    "units_shipped" INTEGER,
    "shipping_costs" MONEY,
    "duty_costs" MONEY,
    "insurance_costs" MONEY,
    "euro_value" MONEY,
    "us_value" MONEY,

    CONSTRAINT "shipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shipment_invoice" (
    "shipment_id" INTEGER,
    "invoice_id" INTEGER,
    "id" SERIAL NOT NULL,

    CONSTRAINT "shipment_invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tarrif" (
    "id" SERIAL NOT NULL,
    "tarrif_code" VARCHAR(24) NOT NULL,
    "description" VARCHAR,
    "material" VARCHAR(64),

    CONSTRAINT "tarrif_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendor" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(128) NOT NULL,
    "type" VARCHAR(64),

    CONSTRAINT "vendor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "color_color_code_key" ON "color"("color_code");

-- CreateIndex
CREATE UNIQUE INDEX "invoice_invoice_number_date_key" ON "invoice"("invoice_number", "date");

-- CreateIndex
CREATE UNIQUE INDEX "payment_reference_number_date_booked_key" ON "payment"("reference_number", "date_booked");

-- CreateIndex
CREATE UNIQUE INDEX "product_product_name_key" ON "product"("product_name");

-- CreateIndex
CREATE UNIQUE INDEX "tarrif_tarrif_code_key" ON "tarrif"("tarrif_code");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_name_key" ON "vendor"("name");

-- AddForeignKey
ALTER TABLE "duty_line_items" ADD CONSTRAINT "duty_line_items_shipment_fk_fkey" FOREIGN KEY ("shipment_fk") REFERENCES "shipment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "duty_line_items" ADD CONSTRAINT "duty_line_items_tarrif_fk_fkey" FOREIGN KEY ("tarrif_fk") REFERENCES "tarrif"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "invoice" ADD CONSTRAINT "invoice_vendor_fk_fkey" FOREIGN KEY ("vendor_fk") REFERENCES "vendor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "invoice_line_items" ADD CONSTRAINT "invoice_line_items_invoice_fk_fkey" FOREIGN KEY ("invoice_fk") REFERENCES "invoice"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "invoice_line_items" ADD CONSTRAINT "invoice_line_items_product_fk_fkey" FOREIGN KEY ("product_fk") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_payment_vendor_fk_fkey" FOREIGN KEY ("payment_vendor_fk") REFERENCES "vendor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "payment_invoice" ADD CONSTRAINT "payment_invoice_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoice"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "payment_invoice" ADD CONSTRAINT "payment_invoice_payment_line_item_id_fkey" FOREIGN KEY ("payment_line_item_id") REFERENCES "payment_line_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "payment_line_item" ADD CONSTRAINT "payment_line_item_payment_fk_fkey" FOREIGN KEY ("payment_fk") REFERENCES "payment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "payment_line_item" ADD CONSTRAINT "payment_line_item_vendor_fk_fkey" FOREIGN KEY ("vendor_fk") REFERENCES "vendor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_tarrif_fk_fkey" FOREIGN KEY ("tarrif_fk") REFERENCES "tarrif"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_color" ADD CONSTRAINT "product_color_colors_id_fkey" FOREIGN KEY ("colors_id") REFERENCES "color"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_color" ADD CONSTRAINT "product_color_products_id_fkey" FOREIGN KEY ("products_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "shipment" ADD CONSTRAINT "shipment_shipping_vendor_fk_fkey" FOREIGN KEY ("shipping_vendor_fk") REFERENCES "vendor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "shipment_invoice" ADD CONSTRAINT "shipment_invoice_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoice"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "shipment_invoice" ADD CONSTRAINT "shipment_invoice_shipment_id_fkey" FOREIGN KEY ("shipment_id") REFERENCES "shipment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
