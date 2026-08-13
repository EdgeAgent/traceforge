CREATE TABLE `inference_runs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`publicId` varchar(32) NOT NULL,
	`sector` varchar(64) NOT NULL,
	`input` text NOT NULL,
	`signal` varchar(255) NOT NULL,
	`confidence` decimal(5,4) NOT NULL,
	`reasoning` text NOT NULL,
	`recommendedAction` text NOT NULL,
	`reviewStatus` enum('auto-approved','needs-review','approved','rejected') NOT NULL DEFAULT 'needs-review',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `inference_runs_id` PRIMARY KEY(`id`),
	CONSTRAINT `inference_runs_publicId_unique` UNIQUE(`publicId`)
);
--> statement-breakpoint
CREATE TABLE `review_actions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`inferenceRunId` int NOT NULL,
	`action` enum('approve','reject','annotate') NOT NULL,
	`annotation` text,
	`reviewerName` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `review_actions_id` PRIMARY KEY(`id`)
);
